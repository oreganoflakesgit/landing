/**
 * @typedef {Object} Post
 * @property {string} slug
 * @property {string} title
 * @property {string} date - ISO date string (YYYY-MM-DD).
 * @property {string} description
 * @property {{src: string, alt: string, width: number, height: number}=} image
 * @property {string[]} body
 */

/** @type {Post[]} */
export const posts = [
  {
    slug: "brigade-de-cuisine",
    title: "Brigade de Cuisine",
    date: "2026-02-28",
    description: "",
    image: {
      src: "/images/brigade_de_cuisine.png",
      alt: "Brigade de Cuisine",
      width: 1672,
      height: 941
    },
    body: [
      "Escoffier turned chaotic kitchens into disciplined systems, then into an art form built on delivery, hierarchy, and hospitality.",
      "That same distinction separates mechanical project administration from real management: invisible coordination, judgement, and trust.",
      "As AI automates the chopping, the people left standing will be the ones who learned to cook and own the pass."
    ]
  },
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
