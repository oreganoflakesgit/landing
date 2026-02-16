import Link from "next/link";
import SiteNav from "../components/SiteNav";

export default function NotFound() {
  return (
    <main>
      <SiteNav />
      <div className="article">
        <h1>404</h1>
        <p>This page could not be found.</p>
        <Link href="/">Go home</Link>
      </div>
    </main>
  );
}
