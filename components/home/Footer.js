const footerClassName = "_78zum5 _1iyjqo2 _dt5ytf _1uz70x1";
const footerTextClassName = "_nqh3do";
const footerLinkClassName = "_1bvjpef";

export default function Footer() {
  return (
    <footer
      className={footerClassName}
      style={{ opacity: 0.7, fontSize: "12px" }}
    >
      <p className={footerTextClassName}>
        Inspired by{" "}
        <a
          href="https://wongmjane.com/"
          target="_blank"
          rel="noreferrer"
          className={footerLinkClassName}
        >
          Wong M Jane
        </a>
      </p>
    </footer>
  );
}
