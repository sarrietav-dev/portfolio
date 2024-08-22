import type { APIContext, InferGetStaticPropsType } from "astro";

import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";
import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site-config";
import { getFormattedDate } from "@/utils";
import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

const ogOptions: SatoriOptions = {
  // debug: true,
  fonts: [
    {
      data: Buffer.from(RobotoMono),
      name: "Roboto Mono",
      style: "normal",
      weight: 400,
    },
    {
      data: Buffer.from(RobotoMonoBold),
      name: "Roboto Mono",
      style: "normal",
      weight: 700,
    },
  ],
  height: 630,
  width: 1200,
};

const markup = (title: string, pubDate: string) =>
  html`
  <div
  style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    backgroundColor: 'white',
    backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
    backgroundSize: '100px 100px',
  }}
>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg
      height={80}
      viewBox="0 0 75 65"
      fill="black"
      style={{ margin: '0 75px' }}
    >
      <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
    </svg>
  </div>
  <div
    style={{
      display: 'flex',
      fontSize: 40,
      fontStyle: 'normal',
      color: 'black',
      marginTop: 30,
      lineHeight: 1.8,
      whiteSpace: 'pre-wrap',
    }}
  >
    <b>Sebastian Arrieta</b>
  </div>
</div>
`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { pubDate, title } = context.props as Props;

  const postDate = getFormattedDate(pubDate, {
    month: "long",
    weekday: "long",
  });
  const svg = await satori(markup(title, postDate), ogOptions);
  const png = new Resvg(svg).render().asPng();
  return new Response(png, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts
    .filter(({ data }) => !data.ogImage)
    .map((post) => ({
      params: { slug: post.slug },
      props: {
        pubDate: post.data.updatedDate ?? post.data.publishDate,
        title: post.data.title,
      },
    }));
}
