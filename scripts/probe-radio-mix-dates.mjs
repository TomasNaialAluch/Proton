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

const dates = [
  "airedAt",
  "airDate",
  "broadcastAt",
  "broadcastDate",
  "recordedAt",
  "releasedAt",
  "startsAt",
  "endsAt",
  "timestamp",
  "time",
  "datetime",
  "mixDate",
  "episodeDate",
  "showDate",
  "dateString",
  "isoDate",
];

for (const c of dates) {
  const q = `query { radioMixes(first: 1) { edges { node { id ${c} } } } }`;
  const j = await post(q);
  if (!j.errors?.length) console.log("OK:", c, JSON.stringify(j.data));
  else console.log("no:", c, j.errors[0].message.split("\n")[0].slice(0, 90));
}

// Show might have schedule fields
const showFields = await post(`
  query {
    radioMixes(first: 1) {
      edges {
        node {
          id
          show {
            id
            name
            slug
            nextBroadcast
            lastBroadcast
            description
          }
        }
      }
    }
  }
`);
console.log("\n--- show extra ---\n", JSON.stringify(showFields, null, 2));
