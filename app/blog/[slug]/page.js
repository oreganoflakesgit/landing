import fs from "fs";
import path from "path";
import Link from "next/link";
import SiteNav from "../../../components/SiteNav";
import MarkdownRenderer from "../../../components/blog/MarkdownRenderer";
import { posts } from "../../../data/posts";

const articleWrapClassName = "_78zum5 _1iyjqo2 _dt5ytf _6s0dn4";
const articleClassName = "_78zum5 _dt5ytf _1iyjqo2 _1uz70x1 _1sjtlrb wide-article";
const metaClassName = "_ss6m8b _1f6x5sh _2lah0s _1a11q2q _18vcv9u";
const titleClassName = "_nqh3do _1c8ti3v _1ve93yz _iksgxq _1fzhlzt";
const descriptionClassName = "_1f6x5sh _1jchvi3 _1evy7pa _1lv5wty";
const sectionHeadingClassName = "_nqh3do _1c3i2sq _1s688f _1d0ylna";
const paragraphClassName = "_nqh3do _1jchvi3 _1evy7pa _1lv5wty";
const listClassName = "_nqh3do _1jchvi3 _1evy7pa _taz4m5 _1cy9i3i _1lv5wty";
const blockquoteClassName =
  "_nqh3do _1jchvi3 _1evy7pa _1facyvu _1t7ytsu _pilrb4 _1xzmaso _1d0ylna";
const codeBlockClassName =
  "_1m1lls2 _1uz70x1 _1j6x5gx _w2csxc _4w1nh8 _1dcheo9 _1evy7pa _1lv5wty";
const inlineCodeClassName = "_4w1nh8 _1dcheo9";
const linkClassName = "_1bvjpef";
const ogImage = "/images/41353cc3-6c9f-4d36-a22b-80189f131fcc.png";
const ogImageAlt = "Portrait of Oregano Flakes";

const markdownDir = path.join(process.cwd(), "data", "posts");

const loadMarkdown = (slug) => {
  try {
    return fs.readFileSync(path.join(markdownDir, `${slug}.md`), "utf8");
  } catch (error) {
    return null;
  }
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = posts.find((item) => item.slug === params.slug);

  if (!post) {
    return {
      title: "Post not found | Oregano Flakes",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const description =
    post.description?.trim() || post.body?.[0] || "Blog post on Oregano Flakes.";
  const url = `/blog/${post.slug}`;
  const publishedTime = `${post.date}T00:00:00.000Z`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      publishedTime,
      authors: ["Oregano Flakes"],
      images: [
        {
          url: ogImage,
          width: 1600,
          height: 2000,
          alt: ogImageAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage]
    }
  };
}

export default function PostPage({ params }) {
  const post = posts.find((item) => item.slug === params.slug);
  const markdown = post ? loadMarkdown(post.slug) : null;

  if (!post) {
    return (
      <main className="_78zum5 _1iyjqo2 _pjyfc _ygnhl5 blog-shell">
        <SiteNav />
        <div className={articleWrapClassName}>
          <div className={articleClassName}>
          <h1>Post not found</h1>
          <p>
            This archive entry does not have content yet. Return to the blog
            index.
          </p>
          <Link href="/blog">Back to blog</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="_78zum5 _1iyjqo2 _pjyfc _ygnhl5 blog-shell">
      <SiteNav />
      <div
        className={articleWrapClassName}
        vt-name="rootContentContainer"
        vt-update="_1mn1rqb"
        vt-share="_1mn1rqb"
      >
        <article className={articleClassName}>
          <p className={metaClassName}>{post.date}</p>
          <h1
            className={titleClassName}
            style={{ viewTransitionName: `blog-title-${post.slug}` }}
          >
            {post.title}
          </h1>
          {post.description ? (
            <p className={descriptionClassName}>{post.description}</p>
          ) : null}
          {markdown ? (
            <MarkdownRenderer
              markdown={markdown}
              classNames={{
                sectionHeading: sectionHeadingClassName,
                paragraph: paragraphClassName,
                list: listClassName,
                blockquote: blockquoteClassName,
                codeBlock: codeBlockClassName,
                inlineCode: inlineCodeClassName,
                link: linkClassName
              }}
            />
          ) : post.body ? (
            post.body.map((paragraph, paragraphIndex) => (
              <p
                key={`fallback-${paragraphIndex}`}
                className={paragraphClassName}
                style={{ textAlign: "justify" }}
              >
                {paragraph}
              </p>
            ))
          ) : null}
          <Link href="/blog" className={linkClassName}>
            Back to blog
          </Link>
        </article>
      </div>
    </main>
  );
}
