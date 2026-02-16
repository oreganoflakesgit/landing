/**
 * @typedef {Object} Post
 * @property {string} slug
 * @property {string} title
 * @property {string} date - ISO date string (YYYY-MM-DD).
 * @property {string} description
 * @property {string[]} body
 */

/** @type {Post[]} */
export const posts = [
  {
    slug: "deliberate-suspension-of-disbelief",
    title: "Deliberate Suspension of Disbelief",
    date: "2025-01-10",
    description: "",
    body: [
      "A look back at text adventures, procedural worlds, and the evolution of immersive experiences.",
      "Why understanding the mechanisms can add wonder instead of subtracting it.",
      "Choosing deliberate suspension of disbelief as the only livable stance toward AI progress."
    ]
  }
];

/** @type {Record<number, Post[]>} */
export const postsByYear = posts.reduce((acc, post) => {
  const year = new Date(post.date).getFullYear();
  if (!acc[year]) acc[year] = [];
  acc[year].push(post);
  return acc;
}, {});
