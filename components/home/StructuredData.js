import { withBasePath } from "../../lib/paths";

const portraitSrc = withBasePath(
  "/images/41353cc3-6c9f-4d36-a22b-80189f131fcc.png"
);
const portraitAlt = "Portrait of Oregano Flakes";

export default function StructuredData({ profile }) {
  const primaryLink = profile.links[0]?.href ?? "";
  const locationName = profile.locations[0]?.name ?? "";
  const locationSameAs =
    locationName === "Poland"
      ? "https://www.wikidata.org/wiki/Q36"
      : undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${primaryLink}#person`,
    name: profile.name,
    alternateName: profile.handle,
    sameAs: primaryLink ? [primaryLink] : [],
    url: primaryLink,
    image: {
      "@type": "ImageObject",
      url: portraitSrc,
      caption: portraitAlt,
      width: "1600",
      height: "2000"
    },
    homeLocation: {
      "@type": "Country",
      name: locationName,
      ...(locationSameAs ? { sameAs: locationSameAs } : {})
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}
