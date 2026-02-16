const listClassName = "_edt4dj _78zum5 _1a02dak _1on947a _10br76f";
const linkClassName =
  "_692ja3 _10bpezv _1y0btm7 _fmgtok _2abnit _1nji11f _1f9vz6m _6s0dn4 _nqh3do _3nfvp2 _l56j7k _1qlcs6k";
const iconWrapClassName = "_6s0dn4 _flga3k _78zum5 _j8txqj _l56j7k";
const iconClassName = "_117rol3 _etbb29 _2lah0s _14atkfc";
const handleClassName = "_87ps6o";

const xIconPath =
  "M18.244 2H21l-6.58 7.518L22 22h-6.172l-4.83-6.4L5.28 22H2l7.044-8.05L2 2h6.33l4.37 5.77L18.244 2zm-1.084 18h1.94L7.6 4H5.56l11.6 16z";

export default function SocialLinks({ profile }) {
  return (
    <ul className={listClassName}>
      {profile.links.map((link) => (
        <li key={link.href}>
          <a
            rel="noopener noreferrer external"
            target="_blank"
            className={linkClassName}
            title={`${link.label}: ${profile.handle}`}
            href={link.href}
          >
            <figure className={iconWrapClassName}>
              <svg
                className={iconClassName}
                focusable="false"
                role="img"
                viewBox="0 0 24 24"
              >
                <path d={xIconPath}></path>
              </svg>
            </figure>
            <span className={handleClassName}>{profile.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
