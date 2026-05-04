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

const candidates = [
  "name",
  "broadcastDate",
  "airDate",
  "publishedAt",
  "createdAt",
  "startsAt",
  "endDate",
  "youtubeId",
  "youtubeVideoId",
  "videoId",
  "slug",
  "url",
  "description",
  "genre",
  "show",
  "artist",
  "image",
  "thumbnail",
  "artwork",
  "coverImage",
  "duration",
  "part",
];

let working = ["id", "__typename"];
for (const c of candidates) {
  const fields = [...working, c].join("\n            ");
  const q = `query { radioMixes(first: 1) { edges { node { ${fields} } } } }`;
  const j = await post(q);
  const err = j.errors?.[0]?.message ?? "";
  if (!j.errors?.length) {
    console.log("OK:", c);
    working.push(c);
  } else if (err.includes("doesn't exist")) {
    console.log("no:", c);
  } else {
    console.log("err", c, err.slice(0, 100));
  }
}

console.log("\nFinal working fields:", working.join(", "));

const sample = await post(`
  query {
    radioMixes(first: 3) {
      edges {
        node {
          id
          __typename
          ${working.filter((f) => f !== "__typename").join("\n          ")}
        }
      }
    }
  }
`);
console.log("\nSample data:\n", JSON.stringify(sample, null, 2));
