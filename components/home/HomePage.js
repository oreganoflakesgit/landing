import SiteNav from "../SiteNav";
import WorldMap from "./WorldMap";
import ProfileCard from "./ProfileCard";
import SocialLinks from "./SocialLinks";
import StructuredData from "./StructuredData";
import HiddenBlogList from "./HiddenBlogList";
import Footer from "./Footer";
import { profile } from "../../data/profile";
import { postsByYear } from "../../data/posts";

const mainClassName = "_78zum5 _1iyjqo2 _pjyfc _ygnhl5";
const contentWrapClassName = "_78zum5 _1iyjqo2 _dt5ytf _6s0dn4";
const innerWrapClassName =
  "_b3r6kr _6s0dn4 _78zum5 _dt5ytf _1iyjqo2 _l56j7k";
const heroSectionClassName =
  "_lttcdf _onv7sz _4131pw _78zum5 _dt5ytf _1n327nk";
const heroMediaClassName = "_1n2onr6 _h8yej3";

export default function HomePage() {
  return (
    <main className={mainClassName}>
      <SiteNav withViewTransitions />
      <div
        className={contentWrapClassName}
        vt-name="rootContentContainer"
        vt-update="_1mn1rqb"
        vt-share="_1mn1rqb"
      >
        <div className={innerWrapClassName}>
          <section className={heroSectionClassName}>
            <div className={heroMediaClassName}>
              <WorldMap locations={profile.locations} />
              <ProfileCard profile={profile} />
            </div>
            <SocialLinks profile={profile} />
          </section>
        </div>
        <StructuredData profile={profile} />
        <HiddenBlogList postsByYear={postsByYear} />
      </div>
      <Footer />
    </main>
  );
}
