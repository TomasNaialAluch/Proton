const h = {
  "Content-Type": "application/json",
  origin: "https://www.protonradio.com",
  referer: "https://www.protonradio.com/",
};

async function post(query) {
  const res = await fetch("https://api.protonradio.com/graphql", {
    method: "POST",
    headers: h,
    body: JSON.stringify({ query }),
  });
  return res.json();
}

const tries = [
  "query { radioMixes(last: 2, genre: \"Progressive\") { edges { node { id } } } }",
  "query { radioMixes(last: 2, showGenre: \"Progressive\") { edges { node { id } } } }",
  "query { radioMixes(last: 2, filter: { genre: \"Progressive\" }) { edges { node { id } } } }",
];

for (const q of tries) {
  const j = await post(q);
  console.log(q.slice(0, 70));
  console.log(j.errors ? j.errors[0].message.slice(0, 150) : "OK");
}
