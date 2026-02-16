import "./globals.css";
import localFont from "next/font/local";

const siteUrl = "https://oreganoflakes.com";
const defaultTitle = "Oregano Flakes";
const defaultDescription = "Oregano Flakes personal website";
const ogImage = "/images/41353cc3-6c9f-4d36-a22b-80189f131fcc.png";
const ogImageAlt = "Portrait of Oregano Flakes";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Oregano Flakes"
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    siteName: defaultTitle,
    type: "website",
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
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage]
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    apple: "/apple-touch-icon.png"
  }
};

const vt323 = localFont({
  src: [
    {
      path: "../public/fonts/VT323/VT323-Regular.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  display: "swap",
  variable: "--font-sans"
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../public/fonts/JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf",
      weight: "100 800",
      style: "normal"
    },
    {
      path: "../public/fonts/JetBrains_Mono/JetBrainsMono-Italic-VariableFont_wght.ttf",
      weight: "100 800",
      style: "italic"
    }
  ],
  display: "swap",
  variable: "--font-mono"
});

const htmlClassName = [
  "_ne03rk _1e7jjv7 _78zum5 _dt5ytf _1j61x8r _1fzhlzt _1it3fuk _zmw1cu _t7dq6l _nqh3do _1eh507v _1us19tq _ish69e _vmm9iu _12wt3hh _txd6ia _qw41rl var(--font-sans)",
  vt323.variable,
  jetbrainsMono.variable
].join(" ");

const bodyClassName = "_1a6aw5i _nqh3do _jp7ctv _1iyjqo2";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={htmlClassName}>
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
