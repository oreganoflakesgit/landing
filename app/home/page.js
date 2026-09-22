import SiteNav from "../../components/SiteNav";
import { withBasePath } from "../../lib/paths";
import styles from "./page.module.css";

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
      <SiteNav />
      <iframe
        className={styles.viewer}
        src={withBasePath("/flat-3d/index.html")}
        title="Interactive 3D flat"
      />
    </main>
  );
}
