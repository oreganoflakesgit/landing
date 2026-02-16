import { WORLD_MAP_DOTS_PATH } from "../../data/worldMapPath";

const svgClassName = "_7giv3 _1n2onr6 _10y9f9r";
const dotsClassName = "_ydnq6f";
const locationClassName =
  "_iigq4a _1s12fnh _re3ea1 _1276wa9 _14o1hi8 _1iy03kw _xj984s _14meu4m";
const locationOutlineClassName = `${dotsClassName} ${locationClassName}`;
const locationFillClassName = `${locationClassName} _19zyb68`;

export default function WorldMap({ locations = [] }) {
  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 600 300"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClassName}
      style={{ "--x-aspectRatio": "2 auto" }}
      vt-name="world-map"
      vt-update="auto"
      vt-share="auto"
    >
      <path
        className={dotsClassName}
        d={WORLD_MAP_DOTS_PATH}
        vt-name="world-map-dots"
        vt-update="auto"
        vt-share="auto"
      />
      <g vt-name="world-map-locations" vt-update="auto" vt-share="auto">
        {locations.map((location) => {
          const pointStyle = {
            "--x-cx": `${location.x}px`,
            "--x-cy": `${location.y}px`
          };

          return (
            <g key={location.name}>
              <circle className={locationOutlineClassName} style={pointStyle} />
              <circle className={locationOutlineClassName} style={pointStyle} />
              <circle
                className={locationFillClassName}
                style={{ ...pointStyle, "--x-fill": "var(--_1tap2wp)" }}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
