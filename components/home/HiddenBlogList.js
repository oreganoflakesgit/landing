import formatPostDate from "../blog/formatPostDate";

const listContainerClassName =
  "_1uz70x1 _amitd3 _1iyjqo2 _h8yej3 _1sjtlrb";
const listWrapClassName = "_1x0kqqy _78zum5 _dt5ytf";
const yearHeadingClassName =
  "_1dvq9vw _1q0q8m5 _so031l _1f6x5sh _ln86er _1ve93yz _1ohvjvq _1hgupqh";
const postRowClassName =
  "_czphqh _1sjv973 _1hl2dhg _1pha0wt _1icol3 _17n77hc _78zum5";
const postDateClassName =
  "_ss6m8b _1f6x5sh _2lah0s _1a11q2q _18vcv9u _ig3uv9 _p4054r";
const postTitleClassName = "_dgco2l _s0hnhe _ci9nys _eq5yr9";

export default function HiddenBlogList({ postsByYear }) {
  const years = Object.keys(postsByYear)
    .map((year) => Number(year))
    .sort((a, b) => b - a);

  if (!years.length) {
    return null;
  }

  return (
    <section className={`${listContainerClassName} visually-hidden`}>
      <div className={listWrapClassName}>
        {years.map((year) => (
          <section key={year} className="_78zum5 _dt5ytf">
            <h2 className={yearHeadingClassName}>{year}</h2>
            <div>
              {postsByYear[year].map((post) => (
                <span key={post.slug} className={postRowClassName}>
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
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
