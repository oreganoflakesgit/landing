const createQuote = ({
  id,
  text,
  author,
  authorUrl,
  primaryHashtag,
  secondaryHashtags
}) => ({
  id,
  text,
  author,
  authorUrl,
  primaryHashtag,
  secondaryHashtags
});

// Add new quotes by appending another createQuote({...}) item below.
export const quotes = [
  createQuote({
    id: "bryan-cheong-data-enemy",
    text: 'People working data really saying things like "data is so fun". No. Data is the enemy. Your job is to defeat it and slay it utterly, to rob it from what you desire and leave it sobbing in the dirt. You must hate the data.',
    author: "Bryan Cheong",
    authorUrl: "https://x.com/bryancsk",
    primaryHashtag: "data",
    secondaryHashtags: ["data", "engineering"]
  }),
  createQuote({
    id: "darrell-huff-torture-data",
    text: "If you torture the data long enough, it will confess to anything.",
    author: "Darrell Huff",
    authorUrl: "https://en.wikipedia.org/wiki/How_to_Lie_with_Statistics",
    primaryHashtag: "data",
    secondaryHashtags: ["engineering"]
  }),
  createQuote({
    id: "amritwt-life-dice",
    text: "The dice will always roll in your favour if you stop acting like a loser.",
    author: "amritwt",
    authorUrl: "https://x.com/amritwt",
    primaryHashtag: "life",
    secondaryHashtags: []
  }),
  createQuote({
    id: "staysaasy-communication-style-repeat",
    text: "If you repeat yourself 3x and nobody understands, there's clearly something wrong with your communication style that you have to change immediately. If you repeat yourself another 3x and people still don't understand, then all the above is true + you're a fuckin idiot.",
    author: "staysaasy",
    authorUrl: "https://x.com/staysaasy/status/2024969060706865341",
    primaryHashtag: "life",
    secondaryHashtags: ["management"]
  }),
  createQuote({
    id: "halvar-flake-spine-luxury",
    text: "The most expensive luxury item you can own is a spine.",
    author: "Halvar Flake",
    authorUrl: "https://x.com/halvarflake/status/2027691153106079868",
    primaryHashtag: "life",
    secondaryHashtags: []
  }),
  createQuote({
    id: "staysaasy-managed-teams-emergencies",
    text: "It's remarkable how well managed teams basically never have emergencies and badly managed teams have emergencies constantly",
    author: "staysaasy",
    authorUrl: "https://x.com/staysaasy/status/2027767930336010698",
    primaryHashtag: "management",
    secondaryHashtags: []
  }),
  createQuote({
    id: "staysaasy-world-runs-on-effort",
    text: "The worst curse that you can inflict on someone is the curse of believing that the world runs on magic. You talk and the deal closes. You write user stories and the product gets launched. No. Not at all. The opposite. The world runs on effort, organization, follow-up. Only.",
    author: "staysaasy",
    authorUrl: "https://x.com/staysaasy/status/2027132385435820097",
    primaryHashtag: "management",
    secondaryHashtags: ["life"]
  }),
  createQuote({
    id: "staysaasy-disagreeing-culture",
    text: "Having a culture where it’s see as immature to disagree is the worst kind of culture there is.",
    author: "staysaasy",
    authorUrl: "https://x.com/staysaasy/status/2026346288631923072",
    primaryHashtag: "management",
    secondaryHashtags: ["life"]
  }),
  createQuote({
    id: "staysaasy-tech-debt-skill-issue",
    text: "Being unable to describe, prove, and easily display the value of doing tech debt is a skill issue.",
    author: "staysaasy",
    authorUrl: "https://x.com/staysaasy/status/2026723653757325693",
    primaryHashtag: "engineering",
    secondaryHashtags: []
  })
];
