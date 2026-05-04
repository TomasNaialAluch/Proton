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

const keys = [
  "showName",
  "artistName",
  "mixId",
  "id",
  "showDate",
  "broadcastDate",
  "partNumber",
  "slug",
];

for (const k of keys) {
  const q = `query { radioMixes(first: 1, orderBy: { ${k}: DESC }) { edges { node { id } } } }`;
  const j = await post(q);
  console.log(
    k,
    j.errors ? j.errors[0].message.split("\n")[0].slice(0, 130) : "OK"
  );
}

// try two keys
const combos = [
  `{ showDate: DESC }`,
  `{ mixId: DESC }`,
  `{ id: DESC }`,
  `{ partNumber: DESC }`,
];

for (const c of combos) {
  const q = `query { radioMixes(first: 3, orderBy: ${c}) { edges { node { id showDate { date } artist { name } show { name } youtubeId } } } }`;
  const j = await post(q);
  console.log("\nCOMBO", c);
  if (j.errors) console.log(j.errors[0].message);
  else console.log(JSON.stringify(j.data, null, 2));
}
