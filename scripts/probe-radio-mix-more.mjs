const endpoint = "https://api.protonradio.com/graphql";
const headers = {
  "Content-Type": "application/json",
  origin: "https://www.protonradio.com",
  referer: "https://www.protonradio.com/",
};

async function post(query) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
  });
  return res.json();
}

const more = [
  "title",
  "mixTitle",
  "episodeTitle",
  "subtitle",
  "label",
  "station",
  "broadcast",
  "releasedAt",
  "startTime",
  "endTime",
  "partNumber",
  "partIndex",
  "week",
  "year",
  "month",
  "day",
  "displayName",
  "fullTitle",
  "shortTitle",
  "path",
  "permalink",
  "href",
  "mix",
  "episode",
  "recording",
  "streamUrl",
  "audioUrl",
  "youtubeUrl",
];

for (const c of more) {
  const q = `query { radioMixes(first: 1) { edges { node { id ${c} } } } }`;
  const j = await post(q);
  const err = j.errors?.[0]?.message ?? "";
  if (!j.errors?.length) console.log("OK:", c, JSON.stringify(j.data));
  else console.log("no:", c, err.split("\n")[0].slice(0, 100));
}

// nested show / artist with minimal fields
const nested = await post(`
  query {
    radioMixes(first: 2) {
      edges {
        node {
          id
          slug
          youtubeId
          artist { id name image { url } }
          show { id name slug }
        }
      }
    }
  }
`);
console.log("\n--- nested artist/show ---\n", JSON.stringify(nested, null, 2));
