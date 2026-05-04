const endpoint = "https://api.protonradio.com/graphql";
const headers = {
  "Content-Type": "application/json",
  origin: "https://www.protonradio.com",
  referer: "https://www.protonradio.com/",
};

async function post(body) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { ok: res.ok, status: res.status, json };
}

// 1) Introspection (often disabled)
const intro = await post({
  query: `{ __schema { queryType { fields { name } } } }`,
});
console.log("--- introspection ---", intro.ok, intro.status);
console.log(JSON.stringify(intro.json).slice(0, 2000));

// 2) mixes query as in app
const mixes = await post({
  operationName: "GetLatestMixes",
  query: `
    query GetLatestMixes($limit: Int, $genre: String) {
      mixes(limit: $limit, genre: $genre) {
        id
        title
        date
        youtubeId
        genre
        artist { id name image { url } }
      }
    }
  `,
  variables: { limit: 5, genre: null },
});
console.log("\n--- mixes query ---", mixes.ok, mixes.status);
console.log(JSON.stringify(mixes.json, null, 2).slice(0, 4000));

// 3) Known working: artist
const artist = await post({
  operationName: "GetArtistWithTracks",
  query: `
    query GetArtistWithTracks($id: ID!) {
      artist(id: $id) {
        id
        name
        image { url }
      }
    }
  `,
  variables: { id: "88457" },
});
console.log("\n--- artist ---");
console.log(JSON.stringify(artist.json, null, 2).slice(0, 1500));

// 4) Guess field names on Query (one at a time)
const guesses = [
  "shows",
  "latestMixes",
  "latestShows",
  "episodes",
  "mixesFeed",
  "radioShows",
  "youtubeMixes",
  "recentMixes",
  "homeMixes",
  "protonMixes",
];
for (const field of guesses) {
  const r = await post({
    query: `query { ${field} { __typename } }`,
  });
  const err = r.json?.errors?.[0]?.message ?? "";
  const ok = r.json?.data?.[field];
  console.log(field, ok ? JSON.stringify(ok) : err.slice(0, 120));
}

// 5) radioMixes (hint from API: "Did you mean radioMixes?")
const rm = await post({
  query: `query { radioMixes { __typename } }`,
});
console.log("\n--- radioMixes bare ---");
console.log(JSON.stringify(rm.json, null, 2).slice(0, 2500));

const rm2 = await post({
  query: `
    query {
      radioMixes(limit: 5) {
        id
        title
        date
        youtubeId
        artist { id name image { url } }
      }
    }
  `,
});
console.log("\n--- radioMixes(limit:5) ---");
console.log(JSON.stringify(rm2.json, null, 2).slice(0, 4000));

// 6) RadioMixConnection shape
const rm3 = await post({
  query: `
    query {
      radioMixes {
        edges {
          cursor
          node {
            __typename
            id
            title
            date
            youtubeId
            artist { id name image { url } }
          }
        }
      }
    }
  `,
});
console.log("\n--- radioMixes edges ---");
console.log(JSON.stringify(rm3.json, null, 2).slice(0, 6000));

const rm4 = await post({
  query: `
    query {
      radioMixes(first: 8) {
        edges {
          node {
            id
            title
            date
            youtubeId
            artist { id name image { url } }
          }
        }
      }
    }
  `,
});
console.log("\n--- radioMixes first:8 ---");
console.log(JSON.stringify(rm4.json, null, 2).slice(0, 6000));
