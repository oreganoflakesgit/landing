import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { withBasePath } from "../../lib/paths";
import styles from "./page.module.css";

// Refresh the embedded document whenever its built assets change.
const viewerVersion = createHash("sha256")
  .update(readFileSync("public/flat-3d/index.html"))
  .digest("hex")
  .slice(0, 12);

export const metadata = {
  title: "Home",
  description: "An interactive 3D view of my flat.",
  alternates: { canonical: "/home/" },
  openGraph: {
    title: "Home | Oregano Flakes",
    description: "An interactive 3D view of my flat.",
    url: "/home/"
  }
};

export default function FlatPage() {
  return (
    <main className={styles.page}>
      <iframe
        className={styles.viewer}
        src={withBasePath(`/flat-3d/index.html?v=${viewerVersion}`)}
        title="Interactive 3D flat"
      />
    </main>
  );
}
