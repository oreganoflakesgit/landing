import SiteNav from "../../components/SiteNav";
import QuotesKnowledgeGraph from "../../components/quotes/QuotesKnowledgeGraph";
import { quotes } from "../../data/quotes";

const quotesDescription =
  "Interactive quote graph with primary hashtag clusters and quote-to-quote links driven by shared secondary hashtags.";
const ogImage = "/images/41353cc3-6c9f-4d36-a22b-80189f131fcc.png";

export const metadata = {
  title: "Quotes | Oregano Flakes",
  description: quotesDescription,
  alternates: {
    canonical: "/quotes"
  },
  openGraph: {
    title: "Quotes | Oregano Flakes",
    description: quotesDescription,
    url: "/quotes",
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
    title: "Quotes | Oregano Flakes",
    description: quotesDescription,
    images: [ogImage]
  }
};

const mainClassName = "_78zum5 _1iyjqo2 _pjyfc _ygnhl5 blog-shell";
const contentWrapClassName = "_78zum5 _1iyjqo2 _dt5ytf _6s0dn4";
const stageClassName = "_78zum5 _dt5ytf _1iyjqo2 quotes-full-stage";

export default function QuotesPage() {
  return (
    <main className={`${mainClassName} quotes-full-page`}>
      <SiteNav />
      <div
        className={`${contentWrapClassName} quotes-full-page-wrap`}
        vt-name="rootContentContainer"
        vt-update="_1mn1rqb"
        vt-share="_1mn1rqb"
      >
        <section className={stageClassName}>
          <QuotesKnowledgeGraph quotes={quotes} />
        </section>
      </div>
    </main>
  );
}
