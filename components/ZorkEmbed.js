"use client";

import { useState } from "react";
import { withBasePath } from "../lib/paths";

export default function ZorkEmbed({
  logoSrc = "/images/zork_sketchy_mono.png",
  minHeight = 640
}) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const resolvedLogoSrc = withBasePath(logoSrc);
  const frameSrc = withBasePath("/visizork/index-game.html");

  const poemLines = [
    "North, South, East, West - choose a road and go;",
    "Or take the slantwise paths where colder hillwinds blow.",
    "Climb what dares your courage. Enter where torches dim.",
    "Look on hall and hearth; examine trinket, tome, and rim.",
    "",
    "Read the runes that linger. Ask what strange relics mean.",
    "Take what you have need of; cast it down when unclean.",
    "Open creaking chests and doors; close them when you must.",
    "Lock with key and word together - keep faith with iron trust.",
    "",
    "Push the stubborn stone. Wake lantern, quench its light.",
    "And when the dark draws nearer - strike with chosen might.",
    "",
    "But heed this, traveler: keep parchment at your side -",
    "Set down your notes and scratch a map with patient, steady pride;",
    "For words forget, and corridors repeat their cruel design,",
    "And only ink will lead you home when fate grows hard to divine."
  ];

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
        src={resolvedLogoSrc}
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
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            aria-label="Open Zork help"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid rgba(80,255,190,0.45)",
              background: "rgba(4,16,12,0.88)",
              color: "#d8ffee",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: 1,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              zIndex: 6
            }}
          >
            i
          </button>
          {isHelpOpen ? (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Zork help"
              onClick={() => setIsHelpOpen(false)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.72)",
                backdropFilter: "blur(1px)",
                zIndex: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px"
              }}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                style={{
                  width: "min(760px, 100%)",
                  maxHeight: "100%",
                  overflowY: "auto",
                  borderRadius: "12px",
                  border: "1px solid rgba(80,255,190,0.45)",
                  background:
                    "radial-gradient(120% 140% at 50% 0%, #14231b 0%, #0a130f 62%, #060906 100%)",
                  color: "#dfffee",
                  boxShadow:
                    "0 22px 42px rgba(0, 0, 0, 0.75), 0 0 18px rgba(80, 255, 190, 0.12)",
                  padding: "14px 14px 12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "8px"
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "18px", letterSpacing: "0.01em" }}>
                    Quick Zork Help
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsHelpOpen(false)}
                    aria-label="Close Zork help"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      border: "1px solid rgba(80,255,190,0.45)",
                      background: "rgba(5, 17, 13, 0.95)",
                      color: "#dfffee",
                      fontSize: "18px",
                      lineHeight: 1,
                      cursor: "pointer"
                    }}
                  >
                    X
                  </button>
                </div>
                <p style={{ margin: "0 0 8px", fontSize: "13px", lineHeight: 1.5 }}>
                  To save or restore, type{" "}
                  <code style={{ fontSize: "12px" }}>SAVE</code> or{" "}
                  <code style={{ fontSize: "12px" }}>RESTORE</code> directly into the game
                  prompt.
                </p>
                <p style={{ margin: "0 0 8px", fontSize: "13px", lineHeight: 1.5 }}>
                  <code style={{ fontSize: "12px" }}>VERBOSE</code>,{" "}
                  <code style={{ fontSize: "12px" }}>BRIEF</code>,{" "}
                  <code style={{ fontSize: "12px" }}>SUPERBRIEF</code>: room descriptions
                  always, once, or never.
                </p>
                <p style={{ margin: "0 0 12px", fontSize: "13px", lineHeight: 1.5 }}>
                  <code style={{ fontSize: "12px" }}>INVENTORY</code> or{" "}
                  <code style={{ fontSize: "12px" }}>I</code>: show what you carry.
                </p>
                <div
                  style={{
                    border: "1px solid rgba(80,255,190,0.3)",
                    borderRadius: "8px",
                    background: "rgba(1, 8, 6, 0.6)",
                    padding: "10px 12px",
                    marginBottom: "12px"
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: 1.55,
                      fontStyle: "italic",
                      whiteSpace: "pre-line"
                    }}
                  >
                    {poemLines.join("\n")}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          <iframe
            src={frameSrc}
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
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer"
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
          rel="noreferrer noopener"
          style={{ textDecoration: "underline" }}
        >
          erkyrath
        </a>
      </p>
    </div>
  );
}
