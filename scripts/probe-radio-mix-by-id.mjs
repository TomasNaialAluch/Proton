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
  `query { radioMix(id: "79062") { id slug artist { name } show { name } } }`,
  `query { radioMix(id: 79062) { id } }`,
];

for (const q of tries) {
  const j = await post(q);
  console.log(q);
  console.log(j.errors ? j.errors[0].message : JSON.stringify(j.data));
}
