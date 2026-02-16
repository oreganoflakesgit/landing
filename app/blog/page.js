import { postsByYear } from "../../data/posts";
import Link from "next/link";
import SiteNav from "../../components/SiteNav";
import formatPostDate from "../../components/blog/formatPostDate";

const blogDescription = "Oregano Flakes personal blog";
const ogImage = "/images/41353cc3-6c9f-4d36-a22b-80189f131fcc.png";

export const metadata = {
  title: "Blog | Oregano Flakes",
  description: blogDescription,
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "Blog | Oregano Flakes",
    description: blogDescription,
    url: "/blog",
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
    title: "Blog | Oregano Flakes",
    description: blogDescription,
    images: [ogImage]
  }
};

const listContainerClassName =
  "_1uz70x1 _amitd3 _1iyjqo2 _h8yej3 _1sjtlrb";

const yearHeadingClassName =
  "_1dvq9vw _1q0q8m5 _so031l _1f6x5sh _ln86er _1ve93yz _1ohvjvq _1hgupqh";

const postRowClassName =
  "_czphqh _1sjv973 _1hl2dhg _1pha0wt _1icol3 _17n77hc _78zum5";

const postDateClassName =
  "_ss6m8b _1f6x5sh _2lah0s _1a11q2q _18vcv9u _ig3uv9 _p4054r";

const postTitleClassName = "_dgco2l _s0hnhe _ci9nys _eq5yr9";

export default function BlogPage() {
  const years = Object.keys(postsByYear)
    .map((year) => Number(year))
    .sort((a, b) => b - a);

  return (
    <main className="_78zum5 _1iyjqo2 _pjyfc _ygnhl5 blog-shell">
      <SiteNav />
      <div
        className="_78zum5 _1iyjqo2 _dt5ytf _6s0dn4"
        vt-name="rootContentContainer"
        vt-update="_1mn1rqb"
        vt-share="_1mn1rqb"
      >
        <section className={listContainerClassName}>
          <div className="_1x0kqqy _78zum5 _dt5ytf">
            {years.map((year) => (
              <section key={year} className="_78zum5 _dt5ytf">
                <h2 className={yearHeadingClassName}>{year}</h2>
                <div>
                  {postsByYear[year].map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className={postRowClassName}
                    >
                      <time
                        dateTime={`${post.date}T00:00:00.000Z`}
                        className={postDateClassName}
                      >
                        {formatPostDate(post.date)}
                      </time>
                      <h3
                        className={postTitleClassName}
                        style={{
                          viewTransitionName: `blog-title-${post.slug}`
                        }}
                      >
                        {post.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
