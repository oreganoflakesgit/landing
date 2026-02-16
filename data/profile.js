/**
 * @typedef {Object} ProfileLink
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {Object} ProfileLocation
 * @property {string} name
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Profile
 * @property {string} name
 * @property {string} handle
 * @property {string} description
 * @property {string} intro
 * @property {ProfileLocation[]} locations
 * @property {ProfileLink[]} links
 */

/** @type {Profile} */
export const profile = {
  name: "Oregano Flakes",
  handle: "oreganoflakes",
  description: "Oregano Flakes personal website",
  intro: "Personal site and blog. Based in Poland.",
  locations: [{ name: "Poland", x: 335, y: 63 }],
  links: [
    {
      label: "Twitter",
      href: "https://x.com/oreganoflakes"
    }
  ]
};
