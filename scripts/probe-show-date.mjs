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

const subs = [
  "date",
  "iso",
  "iso8601",
  "formatted",
  "long",
  "short",
  "display",
  "year",
  "month",
  "day",
  "timestamp",
  "unix",
  "string",
  "value",
  "__typename",
];

for (const s of subs) {
  const q = `query { radioMixes(first: 1) { edges { node { id showDate { ${s} } } } } }`;
  const j = await post(q);
  if (!j.errors?.length) console.log("OK showDate.", s, JSON.stringify(j.data));
  else console.log("no", s, j.errors[0].message.split("\n")[0].slice(0, 100));
}
