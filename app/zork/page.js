import SiteNav from "../../components/SiteNav";
import ZorkEmbed from "../../components/ZorkEmbed";

const zorkDescription = "Play Zork right in the browser.";
const ogImage = "/images/41353cc3-6c9f-4d36-a22b-80189f131fcc.png";

export const metadata = {
  title: "Zork | Oregano Flakes",
  description: zorkDescription,
  alternates: {
    canonical: "/zork"
  },
  openGraph: {
    title: "Zork | Oregano Flakes",
    description: zorkDescription,
    url: "/zork",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1600,
        height: 2000,
        alt: "Portrait of Oregano Flakes"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Zork | Oregano Flakes",
    description: zorkDescription,
    images: [ogImage]
  }
};

const mainClassName = "_78zum5 _1iyjqo2 _pjyfc _ygnhl5";
const contentWrapClassName = "_78zum5 _1iyjqo2 _dt5ytf _6s0dn4";
const frameSectionClassName =
  "_1uz70x1 _amitd3 _1iyjqo2 _h8yej3 _1sjtlrb";

export default function ZorkPage() {
  return (
    <main
      className={mainClassName}
      style={{
        height: "100vh",
        background: "#000",
        color: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <SiteNav />
      <div
        className={contentWrapClassName}
        vt-name="rootContentContainer"
        vt-update="_1mn1rqb"
        vt-share="_1mn1rqb"
        style={{ flex: "1", width: "100%", minHeight: 0, display: "flex" }}
      >
        <section
          className={frameSectionClassName}
          style={{
            flex: "1",
            width: "100%",
            maxWidth: "80ch",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            margin: "0 auto"
          }}
        >
          <ZorkEmbed />
        </section>
      </div>
    </main>
  );
}
