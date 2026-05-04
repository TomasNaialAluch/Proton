const h = {
  "Content-Type": "application/json",
  origin: "https://www.protonradio.com",
  referer: "https://www.protonradio.com/",
};

async function post(query) {
  return fetch("https://api.protonradio.com/graphql", {
    method: "POST",
    headers: h,
    body: JSON.stringify({ query }),
  }).then((r) => r.json());
}

const tries = [
  `query { radioMixes(last: 3, filterBy: { showGenre: "Progressive" }) { edges { node { id show { name } } } } }`,
  `query { radioMixes(last: 3, filterBy: { genre: "Progressive" }) { edges { node { id } } } }`,
  `query { radioMixes(last: 3, filterBy: { showId: "9" }) { edges { node { id } } } }`,
];

for (const q of tries) {
  const j = await post(q);
  console.log(q.slice(0, 85));
  console.log(j.errors ? j.errors[0].message : "OK", j.data?.radioMixes?.edges?.length);
}
