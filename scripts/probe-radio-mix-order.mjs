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

const tries = [
  `query { radioMixes(first: 3, order: DESC) { edges { node { id showDate { date } } } } }`,
  `query { radioMixes(first: 3, sort: RECENT) { edges { node { id showDate { date } } } } }`,
  `query { radioMixes(first: 3, recent: true) { edges { node { id showDate { date } } } } }`,
  `query { radioMixes(first: 3, orderBy: DATE_DESC) { edges { node { id showDate { date } } } } }`,
];

for (const q of tries) {
  const j = await post(q);
  console.log(q.slice(0, 80), "...");
  console.log(JSON.stringify(j).slice(0, 500));
  console.log("---");
}

// radioMixes with no args - check pageInfo
const pi = await post(`
  query {
    radioMixes {
      pageInfo { hasNextPage endCursor }
      edges { cursor node { id showDate { date } artist { name } show { name } youtubeId } }
    }
  }
`);
console.log("pageInfo sample", JSON.stringify(pi, null, 2).slice(0, 2500));
