"use client";

import dynamic from "next/dynamic";
import React, {
  Component,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => <p className="quotes-graph-fallback">Loading 3D graph...</p>
});

const PRIMARY_NODE_COLOR = "#f2f2f2";
const QUOTE_NODE_COLOR = "#8e8e8e";
const ACTIVE_NODE_COLOR = "#ffffff";
const DIMMED_NODE_COLOR = "#0b0b0b";

const GROUP_LINK_COLOR = "rgba(255,255,255,0.22)";
const CONNECTION_LINK_COLOR = "rgba(255,255,255,0.62)";
const DIMMED_LINK_COLOR = "rgba(120,120,120,0.055)";

const toHashtag = (tag) => `#${String(tag || "").replace(/^#/, "")}`;

const normalizeTag = (tag) =>
  String(tag || "")
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/\s+/g, "-");

const shorten = (text, max = 90) =>
  text.length > max ? `${text.slice(0, max - 1)}...` : text;

const readId = (node) => (typeof node === "object" ? node.id : node);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

class GraphErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const supportsWebGL = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch (error) {
    return false;
  }
};

const collectSecondaryTagSet = (quote) =>
  new Set(
    (quote.secondaryHashtags || [])
      .map((tag) => normalizeTag(tag))
      .filter(Boolean)
  );

const normalizeVector = (vector) => {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
};

const crossVector = (left, right) => ({
  x: left.y * right.z - left.z * right.y,
  y: left.z * right.x - left.x * right.z,
  z: left.x * right.y - left.y * right.x
});

const buildTangentBasis = (normal) => {
  const reference = Math.abs(normal.y) < 0.92 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
  const tangent = normalizeVector(crossVector(reference, normal));
  const bitangent = normalizeVector(crossVector(normal, tangent));
  return { tangent, bitangent };
};

const buildPrimaryPositionMap = (primaryTags, quoteCount) => {
  const positionByPrimaryTag = new Map();
  const total = primaryTags.length;
  const totalNodes = total + quoteCount;
  const sparsityBoost = Math.max(0, 12 - totalNodes) * 22;
  const radius = Math.max(320, 260 + total * 28 + sparsityBoost);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  primaryTags.forEach((primaryTag, index) => {
    const ratio = (index + 0.5) / Math.max(total, 1);
    const y = 1 - ratio * 2;
    const projectedRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = index * goldenAngle;
    const nx = Math.cos(angle) * projectedRadius;
    const ny = y;
    const nz = Math.sin(angle) * projectedRadius;

    positionByPrimaryTag.set(primaryTag, {
      x: nx * radius,
      y: ny * radius,
      z: nz * radius,
      nx,
      ny,
      nz
    });
  });

  return positionByPrimaryTag;
};

const buildQuoteConnectionLinks = (quotes, quoteTagSets) => {
  const quoteIdsByTag = new Map();
  const primaryTagByQuoteId = new Map();

  quotes.forEach((quote) => {
    primaryTagByQuoteId.set(quote.id, normalizeTag(quote.primaryHashtag));

    const secondaryTagSet = quoteTagSets.get(quote.id);
    if (!secondaryTagSet?.size) {
      return;
    }

    secondaryTagSet.forEach((tag) => {
      if (!quoteIdsByTag.has(tag)) {
        quoteIdsByTag.set(tag, []);
      }
      quoteIdsByTag.get(tag).push(quote.id);
    });
  });

  const sharedTagsByPair = new Map();

  quoteIdsByTag.forEach((quoteIds, secondaryTag) => {
    if (quoteIds.length < 2) {
      return;
    }

    for (let leftIndex = 0; leftIndex < quoteIds.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < quoteIds.length;
        rightIndex += 1
      ) {
        const leftQuoteId = quoteIds[leftIndex];
        const rightQuoteId = quoteIds[rightIndex];
        const pairKey =
          leftQuoteId < rightQuoteId
            ? `${leftQuoteId}::${rightQuoteId}`
            : `${rightQuoteId}::${leftQuoteId}`;

        if (!sharedTagsByPair.has(pairKey)) {
          sharedTagsByPair.set(pairKey, new Set());
        }
        sharedTagsByPair.get(pairKey).add(secondaryTag);
      }
    }
  });

  const links = [];

  sharedTagsByPair.forEach((sharedTagSet, pairKey) => {
    const [leftQuoteId, rightQuoteId] = pairKey.split("::");
    if (primaryTagByQuoteId.get(leftQuoteId) === primaryTagByQuoteId.get(rightQuoteId)) {
      return;
    }

    const sharedSecondaryTags = Array.from(sharedTagSet).sort();
    links.push({
      source: `quote:${leftQuoteId}`,
      target: `quote:${rightQuoteId}`,
      type: "quote-connection",
      sharedSecondaryTags,
      value: sharedSecondaryTags.length
    });
  });

  return links;
};

const buildGraphData = (quotes) => {
  const nodesById = new Map();
  const links = [];

  const primaryTags = Array.from(
    new Set(quotes.map((quote) => normalizeTag(quote.primaryHashtag)).filter(Boolean))
  ).sort();
  const secondaryTags = Array.from(
    new Set(
      quotes.flatMap((quote) =>
        (quote.secondaryHashtags || []).map((tag) => normalizeTag(tag)).filter(Boolean)
      )
    )
  ).sort();
  const hashtagTags = Array.from(new Set([...primaryTags, ...secondaryTags])).sort();

  const tagPositions = buildPrimaryPositionMap(hashtagTags, quotes.length);
  const firstPrimaryPosition = tagPositions.values().next().value;
  const sphereRadius = firstPrimaryPosition
    ? Math.hypot(
        firstPrimaryPosition.x,
        firstPrimaryPosition.y,
        firstPrimaryPosition.z
      )
    : 360;
  const primaryIndexByTag = new Map(primaryTags.map((tag, index) => [tag, index]));
  const localQuoteIndexByPrimary = new Map();
  const quoteTagSets = new Map(
    quotes.map((quote) => [quote.id, collectSecondaryTagSet(quote)])
  );

  const addNode = (node) => {
    if (!nodesById.has(node.id)) {
      nodesById.set(node.id, node);
    }
  };

  hashtagTags.forEach((hashtagTag) => {
    const position = tagPositions.get(hashtagTag) || {
      x: 0,
      y: 0,
      z: 0
    };

    addNode({
      id: `tag:${hashtagTag}`,
      type: "hashtag",
      hashtag: hashtagTag,
      label: toHashtag(hashtagTag),
      val: 13,
      x: position.x,
      y: position.y,
      z: position.z,
      fx: position.x,
      fy: position.y,
      fz: position.z
    });
  });

  quotes.forEach((quote) => {
    const primaryTag = normalizeTag(quote.primaryHashtag);
    const primaryId = `tag:${primaryTag}`;
    const quoteId = `quote:${quote.id}`;
    const secondaryTagList = Array.from(
      new Set(
        (quote.secondaryHashtags || [])
          .map((tag) => normalizeTag(tag))
          .filter((tag) => Boolean(tag) && tag !== primaryTag)
      )
    );

    const primaryPos = tagPositions.get(primaryTag) || {
      x: 0,
      y: 1,
      z: 0,
      nx: 0,
      ny: 1,
      nz: 0
    };
    const normal = normalizeVector({
      x: primaryPos.nx,
      y: primaryPos.ny,
      z: primaryPos.nz
    });
    let awayVector = normal;
    if (secondaryTagList.length) {
      const centroid = secondaryTagList.reduce(
        (accumulator, tag) => {
          const tagPosition = tagPositions.get(tag);
          if (!tagPosition) {
            return accumulator;
          }
          return {
            x: accumulator.x + tagPosition.x,
            y: accumulator.y + tagPosition.y,
            z: accumulator.z + tagPosition.z
          };
        },
        { x: 0, y: 0, z: 0 }
      );
      centroid.x /= secondaryTagList.length;
      centroid.y /= secondaryTagList.length;
      centroid.z /= secondaryTagList.length;
      awayVector = normalizeVector({
        x: primaryPos.x - centroid.x,
        y: primaryPos.y - centroid.y,
        z: primaryPos.z - centroid.z
      });
    }

    const { tangent, bitangent } = buildTangentBasis(awayVector);

    const localQuoteIndex = localQuoteIndexByPrimary.get(primaryTag) || 0;
    localQuoteIndexByPrimary.set(primaryTag, localQuoteIndex + 1);

    const orbit = 18 + (localQuoteIndex % 4) * 5;
    const primaryOffset = 38 + (localQuoteIndex % 3) * 11;
    const baseAngle =
      localQuoteIndex * 2.12 + (primaryIndexByTag.get(primaryTag) || 0) * 0.68;
    const quoteX =
      primaryPos.x +
      awayVector.x * primaryOffset +
      tangent.x * Math.cos(baseAngle) * orbit +
      bitangent.x * Math.sin(baseAngle) * orbit;
    const quoteY =
      primaryPos.y +
      awayVector.y * primaryOffset +
      tangent.y * Math.cos(baseAngle) * orbit +
      bitangent.y * Math.sin(baseAngle) * orbit;
    const quoteZ =
      primaryPos.z +
      awayVector.z * primaryOffset +
      tangent.z * Math.cos(baseAngle) * orbit +
      bitangent.z * Math.sin(baseAngle) * orbit;

    addNode({
      id: quoteId,
      type: "quote",
      label: shorten(quote.text),
      primaryTag,
      quoteId: quote.id,
      val: 6.2,
      x: quoteX,
      y: quoteY,
      z: quoteZ,
      // Keep quote clusters orbiting around each primary anchor.
      fx: quoteX,
      fy: quoteY,
      fz: quoteZ
    });

    links.push({
      source: primaryId,
      target: quoteId,
      type: "primary-link",
      primaryTag,
      value: 1
    });

    secondaryTagList.forEach((tag) => {
      links.push({
        source: quoteId,
        target: `tag:${tag}`,
        type: "secondary-link",
        secondaryTag: tag,
        value: 1
      });
    });
  });

  links.push(...buildQuoteConnectionLinks(quotes, quoteTagSets));

  const nodes = Array.from(nodesById.values());
  if (!nodes.length) {
    return {
      nodes,
      links,
      sphereRadius: 360,
      nodeCount: 0
    };
  }

  const centroid = nodes.reduce(
    (accumulator, node) => ({
      x: accumulator.x + (node.x || 0),
      y: accumulator.y + (node.y || 0),
      z: accumulator.z + (node.z || 0)
    }),
    { x: 0, y: 0, z: 0 }
  );
  centroid.x /= nodes.length;
  centroid.y /= nodes.length;
  centroid.z /= nodes.length;

  nodes.forEach((node) => {
    node.x = (node.x || 0) - centroid.x;
    node.y = (node.y || 0) - centroid.y;
    node.z = (node.z || 0) - centroid.z;

    if (typeof node.fx === "number") {
      node.fx -= centroid.x;
    }
    if (typeof node.fy === "number") {
      node.fy -= centroid.y;
    }
    if (typeof node.fz === "number") {
      node.fz -= centroid.z;
    }
  });

  const centeredSphereRadius = nodes.reduce((maxDistance, node) => {
    const distance = Math.hypot(node.x || 0, node.y || 0, node.z || 0);
    return Math.max(maxDistance, distance);
  }, 0);

  return {
    nodes,
    links,
    sphereRadius: Math.max(centeredSphereRadius, sphereRadius * 0.55, 180),
    nodeCount: nodes.length
  };
};

const buildHashtagFocusSet = (graphData, selectedTags) => {
  if (!selectedTags?.length) {
    return null;
  }

  const focusedIds = new Set(
    selectedTags.map((tag) => `tag:${normalizeTag(tag)}`)
  );
  const queue = Array.from(focusedIds);
  const adjacency = new Map();

  graphData.links.forEach((link) => {
    if (link.type !== "primary-link" && link.type !== "secondary-link") {
      return;
    }
    const source = readId(link.source);
    const target = readId(link.target);

    if (!adjacency.has(source)) {
      adjacency.set(source, []);
    }
    if (!adjacency.has(target)) {
      adjacency.set(target, []);
    }

    adjacency.get(source).push(target);
    adjacency.get(target).push(source);
  });

  for (let index = 0; index < queue.length; index += 1) {
    const nodeId = queue[index];
    const neighbors = adjacency.get(nodeId) || [];
    neighbors.forEach((neighborId) => {
      if (focusedIds.has(neighborId)) {
        return;
      }

      focusedIds.add(neighborId);
      queue.push(neighborId);
    });
  }

  graphData.links.forEach((link) => {
    const source = readId(link.source);
    const target = readId(link.target);
    if (
      link.type === "quote-connection" &&
      (focusedIds.has(source) || focusedIds.has(target))
    ) {
      focusedIds.add(source);
      focusedIds.add(target);
    }
  });

  return focusedIds;
};

const buildHashtagSummary = (quotes, hashtag) => {
  const normalizedTag = normalizeTag(hashtag);
  const matchingQuotes = quotes.filter((quote) => {
    const primaryMatch = normalizeTag(quote.primaryHashtag) === normalizedTag;
    const secondaryMatch = (quote.secondaryHashtags || []).some(
      (tag) => normalizeTag(tag) === normalizedTag
    );
    return primaryMatch || secondaryMatch;
  });

  const relatedTagCounts = new Map();

  matchingQuotes.forEach((quote) => {
    const allTags = [
      quote.primaryHashtag,
      ...(quote.secondaryHashtags || [])
    ];

    allTags.forEach((tag) => {
      const normalized = normalizeTag(tag);
      if (!normalized || normalized === normalizedTag) {
        return;
      }
      relatedTagCounts.set(normalized, (relatedTagCounts.get(normalized) || 0) + 1);
    });
  });

  return {
    count: matchingQuotes.length,
    topRelated: Array.from(relatedTagCounts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([tag]) => tag)
  };
};

export default function QuotesKnowledgeGraph({ quotes }) {
  const graphRef = useRef(null);
  const hasAutoFit = useRef(false);
  const shellRef = useRef(null);
  const popoverRef = useRef(null);
  const popoverRafRef = useRef(null);
  const pinnedNodeRef = useRef(null);
  const selectedNodeRef = useRef(null);
  const pointerPositionRef = useRef(null);

  const [size, setSize] = useState({ width: 320, height: 560 });
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pinnedNode, setPinnedNode] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState(null);
  const [canRender3D, setCanRender3D] = useState(false);

  const graphData = useMemo(() => buildGraphData(quotes || []), [quotes]);

  const hashtagTags = useMemo(() => {
    const unique = new Set(
      (quotes || []).flatMap((quote) => [
        normalizeTag(quote.primaryHashtag),
        ...(quote.secondaryHashtags || []).map((tag) => normalizeTag(tag))
      ])
    );
    return Array.from(unique).filter(Boolean).sort();
  }, [quotes]);

  const selectedHashtagSet = useMemo(
    () => new Set(selectedHashtags.map((tag) => normalizeTag(tag))),
    [selectedHashtags]
  );

  const focusedNodeIds = useMemo(
    () => buildHashtagFocusSet(graphData, selectedHashtags),
    [graphData, selectedHashtags]
  );

  const quoteConnectionLinksByNodeId = useMemo(() => {
    const byNodeId = new Map();

    graphData.links.forEach((link) => {
      if (link.type !== "quote-connection") {
        return;
      }

      const source = readId(link.source);
      const target = readId(link.target);
      if (!byNodeId.has(source)) {
        byNodeId.set(source, []);
      }
      if (!byNodeId.has(target)) {
        byNodeId.set(target, []);
      }

      byNodeId.get(source).push(link);
      byNodeId.get(target).push(link);
    });

    return byNodeId;
  }, [graphData.links]);

  const selectedNodeDetails = useMemo(() => {
    if (!selectedNode) {
      return null;
    }

    if (selectedNode.type === "quote") {
      const quote = (quotes || []).find((item) => item.id === selectedNode.quoteId);
      if (!quote) {
        return null;
      }

      const relatedLinks = [...(quoteConnectionLinksByNodeId.get(selectedNode.id) || [])]
        .sort(
          (left, right) =>
            (right.sharedSecondaryTags?.length || 0) -
            (left.sharedSecondaryTags?.length || 0)
        )
        .slice(0, 4);

      const sharedTags = Array.from(
        new Set(
          relatedLinks.flatMap((link) => link.sharedSecondaryTags || [])
        )
      );

      return {
        type: "quote",
        title: "Quote",
        text: quote.text,
        author: quote.author,
        authorUrl: quote.authorUrl,
        hashtags: Array.from(
          new Set([
            normalizeTag(quote.primaryHashtag),
            ...(quote.secondaryHashtags || []).map((tag) => normalizeTag(tag))
          ])
        ).filter(Boolean),
        sharedTags
      };
    }

    if (selectedNode.type === "hashtag") {
      const summary = buildHashtagSummary(quotes || [], selectedNode.hashtag);
      return {
        type: "hashtag",
        title: "Hashtag",
        text: `${toHashtag(selectedNode.hashtag)} (${summary.count} quotes)`,
        topRelated: summary.topRelated
      };
    }

    return null;
  }, [quoteConnectionLinksByNodeId, quotes, selectedNode]);

  useEffect(() => {
    setCanRender3D(supportsWebGL());
  }, []);

  useEffect(() => {
    pinnedNodeRef.current = pinnedNode;
  }, [pinnedNode]);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(
    () => () => {
      if (popoverRafRef.current) {
        cancelAnimationFrame(popoverRafRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!shellRef.current || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = Math.max(320, Math.floor(entry.contentRect.width));
      const height = Math.max(520, Math.floor(entry.contentRect.height));
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height }
      );
    });

    resizeObserver.observe(shellRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

    graphRef.current.d3Force("center", null);

    const linkForce = graphRef.current.d3Force("link");
    if (linkForce) {
      const quoteToHashtagDistance = Math.max(120, graphData.sphereRadius * 0.3);
      const connectionDistance = Math.max(260, graphData.sphereRadius * 0.9);
      linkForce
        .distance((link) => {
          if (link.type === "primary-link" || link.type === "secondary-link") {
            return quoteToHashtagDistance;
          }
          return connectionDistance;
        })
        .strength((link) => {
          if (link.type === "primary-link" || link.type === "secondary-link") {
            return 0.12;
          }
          return 0.018;
        });
    }

    const chargeForce = graphRef.current.d3Force("charge");
    if (chargeForce) {
      chargeForce
        .strength(-26)
        .distanceMax(Math.max(980, graphData.sphereRadius * 2.4));
    }

    const controls = graphRef.current.controls?.();
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.autoRotate = false;
      controls.autoRotateSpeed = 0;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI * 0.16;
      controls.maxPolarAngle = Math.PI * 0.84;
      controls.minDistance = graphData.sphereRadius * 1.45;
      controls.maxDistance = graphData.sphereRadius * 5.4;
    }

    graphRef.current.d3ReheatSimulation();
  }, [graphData]);

  const isNodeFocused = (node) =>
    !focusedNodeIds || focusedNodeIds.has(readId(node));

  const isLinkFocused = (link) =>
    !focusedNodeIds ||
    (focusedNodeIds.has(readId(link.source)) && focusedNodeIds.has(readId(link.target)));

  const nodeColor = (node) => {
    if (!isNodeFocused(node)) {
      return DIMMED_NODE_COLOR;
    }

    if (
      (selectedNode && selectedNode.id === node.id) ||
      hoveredNodeId === node.id
    ) {
      return ACTIVE_NODE_COLOR;
    }

    if (node.type === "hashtag") {
      return PRIMARY_NODE_COLOR;
    }

    return QUOTE_NODE_COLOR;
  };

  const linkColor = (link) => {
    if (!isLinkFocused(link)) {
      return DIMMED_LINK_COLOR;
    }

    if (link.type === "primary-link" || link.type === "secondary-link") {
      return GROUP_LINK_COLOR;
    }

    return CONNECTION_LINK_COLOR;
  };

  const linkWidth = (link) => {
    if (link.type === "primary-link" || link.type === "secondary-link") {
      return 1.1;
    }
    return Math.min(3.5, 1 + (link.sharedSecondaryTags?.length || 1) * 0.55);
  };

  const getSidebarOverlap = useCallback(() => {
    if (typeof document === "undefined" || !shellRef.current) {
      return 0;
    }

    const shellRect = shellRef.current.getBoundingClientRect();
    const nav = document.querySelector("main > nav");
    if (!nav) {
      return 0;
    }

    const navRect = nav.getBoundingClientRect();
    const overlapsVertically =
      navRect.bottom > shellRect.top && navRect.top < shellRect.bottom;
    if (!overlapsVertically) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(shellRect.right, navRect.right) -
        Math.max(shellRect.left, navRect.left)
    );
  }, []);

  const fitCameraToGraph = useCallback(
    (duration = 900) => {
      if (!graphRef.current || !graphData.nodeCount) {
        return;
      }

      const radius = Math.max(graphData.sphereRadius || 360, 180);
      const sidebarOverlap = getSidebarOverlap();
      const basePadding = clamp(
        Math.min(size.width, size.height) * 0.16,
        70,
        220
      );
      const fitPadding = Math.round(basePadding + sidebarOverlap * 0.75);

      if (typeof graphRef.current.zoomToFit === "function") {
        graphRef.current.zoomToFit(duration, fitPadding, () => true);
      }

      const controls = graphRef.current.controls?.();
      if (controls) {
        controls.minDistance = Math.max(radius * 1.05, 260);
        controls.maxDistance = Math.max(radius * 7.2, 2200);
      }
    },
    [
      getSidebarOverlap,
      graphData.nodeCount,
      graphData.sphereRadius,
      size.height,
      size.width
    ]
  );

  const placePopover = useCallback(
    (rawX, rawY) => {
      const estimatedPopoverHeight = Math.min(330, Math.max(190, size.height * 0.34));
      const horizontalMargin = Math.min(
        280,
        Math.max(120, Math.floor(size.width * 0.25))
      );
      const padding = 16;
      const prefersBottom = rawY < estimatedPopoverHeight * 0.72;
      const canPlaceBottom = rawY + estimatedPopoverHeight + 26 < size.height - padding;
      const canPlaceTop = rawY - estimatedPopoverHeight - 26 > padding;

      let placement = "top";
      if (prefersBottom && canPlaceBottom) {
        placement = "bottom";
      } else if (!prefersBottom && !canPlaceTop && canPlaceBottom) {
        placement = "bottom";
      } else if (!canPlaceTop && canPlaceBottom) {
        placement = "bottom";
      }

      const x = clamp(rawX, horizontalMargin, size.width - horizontalMargin);
      const yMin = placement === "top" ? estimatedPopoverHeight + padding : padding;
      const yMax =
        placement === "top"
          ? size.height - padding
          : size.height - estimatedPopoverHeight - padding;
      const y = clamp(rawY, yMin, yMax);

      return { x, y, placement };
    },
    [size.width, size.height]
  );

  const getNodeScreenCoords = useCallback((node) => {
    if (!node) {
      return null;
    }

    if (
      graphRef.current &&
      typeof graphRef.current.graph2ScreenCoords === "function" &&
      typeof node.x === "number" &&
      typeof node.y === "number" &&
      typeof node.z === "number"
    ) {
      const coords = graphRef.current.graph2ScreenCoords(node.x, node.y, node.z);
      if (coords && typeof coords.x === "number" && typeof coords.y === "number") {
        return { x: coords.x, y: coords.y };
      }
    }

    return null;
  }, []);

  const setPopoverFromNode = useCallback(
    (node, fallbackPoint = null) => {
      const anchor = getNodeScreenCoords(node) || fallbackPoint || null;
      if (!anchor) {
        return false;
      }

      const next = placePopover(anchor.x, anchor.y);
      setPopoverPosition((current) => {
        if (
          current &&
          current.placement === next.placement &&
          Math.abs(current.x - next.x) < 1 &&
          Math.abs(current.y - next.y) < 1
        ) {
          return current;
        }
        return next;
      });

      return true;
    },
    [getNodeScreenCoords, placePopover]
  );

  const requestPopoverUpdate = useCallback(
    (nodeOverride = null) => {
      if (pinnedNodeRef.current) {
        return;
      }

      const node = nodeOverride || selectedNodeRef.current;
      if (!node) {
        return;
      }

      if (popoverRafRef.current) {
        cancelAnimationFrame(popoverRafRef.current);
      }

      popoverRafRef.current = requestAnimationFrame(() => {
        popoverRafRef.current = null;
        setPopoverFromNode(node, pointerPositionRef.current || null);
      });
    },
    [setPopoverFromNode]
  );

  const clearPinnedAndSelection = useCallback(() => {
    if (popoverRafRef.current) {
      cancelAnimationFrame(popoverRafRef.current);
      popoverRafRef.current = null;
    }

    pointerPositionRef.current = null;
    setPinnedNode(null);
    setSelectedNode(null);
    setHoveredNodeId(null);
    setPopoverPosition(null);
  }, []);

  const clearHoverSelection = useCallback(() => {
    pointerPositionRef.current = null;
    setHoveredNodeId(null);
    if (pinnedNodeRef.current) {
      return;
    }
    setSelectedNode(null);
    setPopoverPosition(null);
  }, []);

  useEffect(() => {
    if (!selectedNode || pinnedNode) {
      if (!selectedNode) {
        setPopoverPosition(null);
      }
      return undefined;
    }

    if (!setPopoverFromNode(selectedNode, pointerPositionRef.current || null)) {
      setPopoverPosition(null);
    }
    return undefined;
  }, [pinnedNode, selectedNode, setPopoverFromNode, size.height, size.width]);

  useEffect(() => {
    if (!canRender3D || !graphRef.current) {
      return undefined;
    }

    const controls = graphRef.current.controls?.();
    if (!controls || typeof controls.addEventListener !== "function") {
      return undefined;
    }

    const handleControlsChange = () => {
      requestPopoverUpdate();
    };

    controls.addEventListener("change", handleControlsChange);
    return () => {
      controls.removeEventListener("change", handleControlsChange);
    };
  }, [canRender3D, graphData.nodeCount, requestPopoverUpdate]);

  useEffect(() => {
    if (!pinnedNode) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (popoverRef.current && popoverRef.current.contains(event.target)) {
        return;
      }
      clearPinnedAndSelection();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [clearPinnedAndSelection, pinnedNode]);

  useEffect(() => {
    hasAutoFit.current = false;
  }, [graphData.nodeCount, graphData.sphereRadius, size.height, size.width]);

  useEffect(() => {
    if (!canRender3D || !graphData.nodeCount) {
      return undefined;
    }

    const initialFit = setTimeout(() => fitCameraToGraph(0), 60);
    const settleFit = setTimeout(() => fitCameraToGraph(700), 420);

    return () => {
      clearTimeout(initialFit);
      clearTimeout(settleFit);
    };
  }, [canRender3D, fitCameraToGraph, graphData.nodeCount]);

  const toggleHashtagFilter = useCallback((tag) => {
    const normalizedTag = normalizeTag(tag);
    setSelectedHashtags((current) =>
      current.includes(normalizedTag)
        ? current.filter((tag) => tag !== normalizedTag)
        : [...current, normalizedTag]
    );
  }, []);

  const handleNodeClick = (node, event) => {
    if (!node) {
      return;
    }

    setPinnedNode(node);
    setSelectedNode(node);
    setHoveredNodeId(node?.id || null);

    let fallbackPoint = pointerPositionRef.current || null;
    if (event && typeof event.clientX === "number") {
      const rect = shellRef.current?.getBoundingClientRect();
      if (rect) {
        fallbackPoint = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }
    }
    setPopoverFromNode(node, fallbackPoint);
  };

  return (
    <section className="quotes-graph-stage">
      <div className="quotes-tag-controls quotes-tag-controls--floating">
        <button
          type="button"
          className={`quotes-tag-button${
            selectedHashtags.length ? "" : " is-active"
          }`}
          onClick={() => {
            clearPinnedAndSelection();
            setSelectedHashtags([]);
          }}
        >
          All clusters
        </button>
        {hashtagTags.map((hashtag) => (
          <button
            key={hashtag}
            type="button"
            className={`quotes-tag-button${
              selectedHashtagSet.has(hashtag) ? " is-active" : ""
            }`}
            onClick={() => {
              clearPinnedAndSelection();
              toggleHashtagFilter(hashtag);
            }}
          >
            {toHashtag(hashtag)}
          </button>
        ))}
      </div>

      <div
        ref={shellRef}
        className="quotes-graph-shell quotes-graph-shell--page"
        onMouseMove={(event) => {
          if (!shellRef.current) {
            return;
          }
          const rect = shellRef.current.getBoundingClientRect();
          pointerPositionRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          };

          requestPopoverUpdate();
        }}
        onMouseLeave={clearHoverSelection}
      >
        {canRender3D ? (
          <GraphErrorBoundary
            fallback={
              <p className="quotes-graph-fallback">
                3D graph could not be initialized in this browser.
              </p>
            }
          >
            <ForceGraph3D
              ref={graphRef}
              graphData={graphData}
              width={size.width}
              height={size.height}
              backgroundColor="#030303"
              nodeRelSize={4.8}
              nodeOpacity={0.95}
              nodeResolution={12}
              nodeColor={nodeColor}
              nodeVal={(node) => {
                if (!isNodeFocused(node)) {
                  return Math.max(1.25, (node.val || 7) * 0.18);
                }
                return node.val || 7;
              }}
              nodeLabel={() => ""}
              linkLabel={() => ""}
              linkColor={linkColor}
              linkOpacity={0.95}
              linkWidth={linkWidth}
              linkDirectionalParticles={(link) =>
                link.type === "quote-connection"
                  ? Math.min(5, link.sharedSecondaryTags?.length || 1)
                  : 0
              }
              linkDirectionalParticleWidth={1.8}
              linkDirectionalParticleSpeed={0.0032}
              linkCurvature={(link) => (link.type === "quote-connection" ? 0.12 : 0)}
              cooldownTicks={1}
              d3AlphaDecay={0.024}
              d3VelocityDecay={0.28}
              onNodeHover={(node) => {
                setHoveredNodeId(node?.id || null);
                if (pinnedNodeRef.current) {
                  return;
                }

                if (node) {
                  setSelectedNode(node);
                  setPopoverFromNode(node, pointerPositionRef.current || null);
                  return;
                }

                setSelectedNode(null);
                setPopoverPosition(null);
              }}
              onNodeClick={handleNodeClick}
              onBackgroundClick={clearPinnedAndSelection}
              enableNodeDrag={false}
              onEngineStop={() => {
                if (hasAutoFit.current || !graphRef.current) {
                  return;
                }
                hasAutoFit.current = true;
                fitCameraToGraph(900);
              }}
            />
          </GraphErrorBoundary>
        ) : (
          <p className="quotes-graph-fallback">
            3D graph is unavailable in this browser environment.
          </p>
        )}

        {selectedNodeDetails && popoverPosition ? (
          <aside
            ref={popoverRef}
            className={`quotes-node-popover quotes-node-popover--from-node${
              popoverPosition.placement === "bottom" ? " quotes-node-popover--below" : ""
            }`}
            role="status"
            aria-live="polite"
            style={{
              left: `${popoverPosition.x}px`,
              top: `${popoverPosition.y}px`
            }}
          >
            <p className="quotes-node-popover-label">{selectedNodeDetails.title}</p>

            {selectedNodeDetails.type === "quote" ? (
              <>
                <p className="quotes-node-popover-text">{selectedNodeDetails.text}</p>
                <p className="quotes-node-popover-author">
                  ~{" "}
                  <a
                    href={selectedNodeDetails.authorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="quotes-node-popover-link"
                  >
                    {selectedNodeDetails.author}
                  </a>
                </p>
                <p className="quotes-node-popover-tags">
                  {selectedNodeDetails.hashtags.map((tag) => (
                    <span key={`popover-hashtag-${selectedNodeDetails.author}-${tag}`} className="quotes-hashtag-tag">
                      {toHashtag(tag)}
                    </span>
                  ))}
                </p>
                {selectedNodeDetails.sharedTags?.length ? (
                  <p className="quotes-node-popover-meta">
                    Connects via: {selectedNodeDetails.sharedTags.map(toHashtag).join(" ")}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="quotes-node-popover-text">{selectedNodeDetails.text}</p>
                {selectedNodeDetails.topRelated?.length ? (
                  <p className="quotes-node-popover-meta">
                    Related tags: {selectedNodeDetails.topRelated.map(toHashtag).join(" ")}
                  </p>
                ) : null}
              </>
            )}
          </aside>
        ) : null}
      </div>
    </section>
  );
}
