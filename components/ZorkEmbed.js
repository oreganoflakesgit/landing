export default function ZorkEmbed({
  logoSrc = "/images/zork_sketchy_mono.png",
  minHeight = 640
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%"
      }}
    >
      <img
        src={logoSrc}
        alt="Zork"
        style={{
          width: "260px",
          height: "auto",
          margin: "0 auto",
          display: "block"
        }}
      />
      <div
        className="crt-shell"
        style={{ minHeight: `${minHeight}px`, height: `${minHeight}px` }}
      >
        <div className="crt-screen" style={{ height: "100%" }}>
          <iframe
            src="/visizork/index-game.html"
            title="Zork 1"
            className="zork-iframe"
            style={{
              width: "85%",
              height: "100%",
              border: "0",
              borderRadius: "12px",
              margin: "0 auto",
              background: "transparent",
              display: "block"
            }}
            allow="fullscreen"
          />
        </div>
        <div className="crt-glow" aria-hidden="true" />
      </div>
      <p
        style={{
          fontSize: "14px",
          opacity: 0.7,
          textAlign: "center",
          margin: 0
        }}
      >
        Zork I: The Great Underground Empire emulation courtesy of{" "}
        <a
          href="https://github.com/erkyrath/visizork"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "underline" }}
        >
          erkyrath
        </a>
      </p>
    </div>
  );
}
