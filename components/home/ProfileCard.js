import { withBasePath } from "../../lib/paths";

const profileCardClassName =
  "_4131pw _78zum5 _k50ysn _1of4z1n _1o0tod _1tj1r3y _10l6tqk _1n327nk";
const portraitWrapClassName = "_x20hqb _7giv3 _1y5e3q9 _nqh3do _1qj20 _1n2onr6 _87ps6o";
const portraitClassName = "_10no89f _nehryp _193iq5w _10l6tqk _t7dq6l";
const captionClassName = "_78zum5 _dt5ytf _l56j7k";
const nameClassName = "_nqh3do _1rg5ohu _11w5x4 _te3ayu _iksgxq _eq5yr9";
const locationRowClassName = "_1dfy8wd _6s0dn4 _78zum5 _1ehd6gj";
const locationIconWrapClassName = "_1a2a7pz _k2swo9 _t0e3qv";

const portraitSrc = withBasePath(
  "/images/41353cc3-6c9f-4d36-a22b-80189f131fcc.png"
);
const portraitAlt = "Portrait of Oregano Flakes";

export default function ProfileCard({ profile }) {
  const location = profile.locations?.[0] ?? { name: "" };

  return (
    <figure itemScope itemType="https://schema.org/Person" className={profileCardClassName}>
      <picture className={portraitWrapClassName}>
        <img
          alt={portraitAlt}
          itemProp="image"
          fetchPriority="high"
          width="1600"
          height="2000"
          decoding="async"
          data-nimg="1"
          className={portraitClassName}
          style={{ color: "transparent" }}
          src={portraitSrc}
        />
      </picture>
      <figcaption className={captionClassName}>
        <p>
          <span
            itemProp="name"
            lang="en"
            style={{ viewTransitionName: "author-name" }}
            translate="no"
            className={nameClassName}
          >
            {profile.handle}
          </span>
        </p>
        <div className="_ji6nmz">
          <p
            itemScope
            itemProp="homeLocation"
            itemType="https://schema.org/City"
            className={locationRowClassName}
          >
            <span
              inert=""
              draggable="false"
              id="_S_1_"
              rel="nofollow noindex noreferrer noopener"
              tabIndex={-1}
              className={locationIconWrapClassName}
            >
              <svg
                className="_bh8q5q _73je2i _1owpc8m _1f6yumg _vlca1e _flga3k _1rg5ohu _j8txqj"
                focusable="false"
                role="img"
                viewBox="0 0 24 24"
                aria-label={location?.name}
              >
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
              </svg>
            </span>
            <span itemProp="name">{location?.name}</span>
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
