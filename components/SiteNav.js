import Link from "next/link";
import { withBasePath } from "../lib/paths";

const navClassName =
  "_lttcdf _czphqh _6s0dn4 _145ct6e _1m75h50 _1f6x5sh _78zum5 _1vqtf37 _6esm2n _1a11q2q _dgco2l _1huwfqn _s0hnhe _jat59b _1wj9ous _lbgzzq _14g40p9 _agqw05 _kh2ocl _7wzq59";

const logoClassName = "_1lliihq";
const logoImageClassName =
  "_117rol3 _flga3k _5ii8vk _1q839t6 _j8txqj _1cw056v _18htf0m";

const navLinkClassName =
  "_vmahel _1s58lsb _1f6x5sh _1h83x41 _vxrtwt _vruv2t _87ps6o _4furqs";

export default function SiteNav({ withViewTransitions = false }) {
  const navLinkProps = withViewTransitions
    ? {
        "vt-name": "nav-link--blog",
        "vt-update": "_1mn1rqb",
        "vt-share": "_1mn1rqb"
      }
    : {};

  const logoProps = withViewTransitions
    ? {
        "vt-name": "site-logo",
        "vt-update": "_1mn1rqb",
        "vt-share": "_1mn1rqb"
      }
    : {};

  const logoSrc = withBasePath("/images/oregano.png");
  return (
    <nav
      className={navClassName}
      style={{
        background: "transparent",
        backgroundColor: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        boxShadow: "none"
      }}
    >
      <span aria-label="Home" className={logoClassName} {...logoProps}>
        <Link href="/" aria-label="Home" className={logoClassName}>
          <img
            className={logoImageClassName}
            src={logoSrc}
            alt="Oregano"
            decoding="async"
          />
        </Link>
      </span>
      <div></div>
      <ul className="_jp7ctv">
        <li className="_jp7ctv">
          <Link href="/blog" className={navLinkClassName} {...navLinkProps}>
            Blog
          </Link>
        </li>
        <li className="_jp7ctv">
          <Link href="/zork" className={navLinkClassName}>
            Zork
          </Link>
        </li>
      </ul>
    </nav>
  );
}
