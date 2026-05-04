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

const literals = [
  "BROADCAST_DATE_DESC",
  "DATE_DESC",
  "SHOW_DATE_DESC",
  "RECENT",
  "NEWEST",
  "LATEST",
  "AIR_DATE_DESC",
  "DESC",
];

for (const L of literals) {
  const q = `query { radioMixes(first: 2, orderBy: ${L}) { edges { node { id showDate { date } youtubeId } } } }`;
  const j = await post(q);
  console.log(L, j.errors ? j.errors[0].message.slice(0, 120) : "OK " + JSON.stringify(j.data));
}

// object form
const objs = [
  `{ field: SHOW_DATE, direction: DESC }`,
  `{ field: DATE, direction: DESC }`,
  `{ showDate: DESC }`,
];

for (const o of objs) {
  const q = `query { radioMixes(first: 2, orderBy: ${o}) { edges { node { id showDate { date } } } } }`;
  const j = await post(q);
  console.log("obj", o.slice(0, 40), j.errors ? j.errors[0].message.slice(0, 140) : "OK");
}
