import { posts } from "../data/posts";

const siteUrl = "https://oreganoflakes.com";

export default function sitemap() {
  const staticRoutes = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/zork`,
      changeFrequency: "monthly",
      priority: 0.5
    }
  ];

  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6
  }));

  return [...staticRoutes, ...postRoutes];
}
