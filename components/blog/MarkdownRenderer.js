import ZorkEmbed from "../ZorkEmbed";

const parseInline = (text, keyPrefix, inlineCodeClassName, linkClassName) => {
  const inlinePattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`)/g;
  const parts = [];
  let lastIndex = 0;
  let inlineIndex = 0;

  for (const match of text.matchAll(inlinePattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    if (match[4]) {
      parts.push(
        <code
          key={`${keyPrefix}-code-${inlineIndex}`}
          className={inlineCodeClassName}
        >
          {match[4]}
        </code>
      );
    } else {
      parts.push(
        <a
          key={`${keyPrefix}-link-${inlineIndex}`}
          href={match[3]}
          className={linkClassName}
          target="_blank"
          rel="noreferrer"
        >
          {match[2]}
        </a>
      );
    }

    inlineIndex += 1;
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export default function MarkdownRenderer({
  markdown,
  classNames: {
    sectionHeading,
    paragraph,
    list,
    blockquote,
    codeBlock,
    inlineCode,
    link
  }
}) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;
  let key = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.trim() === "[[ZORK_EMBED]]") {
      blocks.push(
        <div key={`zork-${key}`} style={{ margin: "24px 0" }}>
          <ZorkEmbed />
        </div>
      );
      index += 1;
      key += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={`code-${key}`} className={codeBlock}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      key += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const headingText = line.replace(/^##\s+/, "").trim();
      blocks.push(
        <h2 key={`heading-${key}`} className={sectionHeading}>
          {parseInline(headingText, `heading-${key}`, inlineCode, link)}
        </h2>
      );
      index += 1;
      key += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (index < lines.length && lines[index].startsWith("> ")) {
        quoteLines.push(lines[index].replace(/^>\s?/, "").trim());
        index += 1;
      }
      blocks.push(
        <blockquote key={`quote-${key}`} className={blockquote}>
          {parseInline(quoteLines.join(" "), `quote-${key}`, inlineCode, link)}
        </blockquote>
      );
      key += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].replace(/^- /, "").trim());
        index += 1;
      }
      blocks.push(
        <ul key={`list-${key}`} className={list}>
          {items.map((item, itemIndex) => (
            <li key={`list-${key}-${itemIndex}`}>
              {parseInline(item, `list-${key}-${itemIndex}`, inlineCode, link)}
            </li>
          ))}
        </ul>
      );
      key += 1;
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length && lines[index].trim()) {
      if (
        lines[index].startsWith("## ") ||
        lines[index].startsWith("- ") ||
        lines[index].startsWith("> ") ||
        lines[index].startsWith("```")
      ) {
        break;
      }
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${key}`} className={paragraph}>
        {parseInline(
          paragraphLines.join(" "),
          `paragraph-${key}`,
          inlineCode,
          link
        )}
      </p>
    );
    key += 1;
  }

  return <>{blocks}</>;
}
