const h = {
  "Content-Type": "application/json",
  origin: "https://www.protonradio.com",
  referer: "https://www.protonradio.com/",
};

const q1 = `
query A($limit: Int!, $filterBy: RadioMixFilterInput) {
  radioMixes(last: $limit, filterBy: $filterBy) {
    edges { node { id } }
  }
}
`;

for (const vars of [
  { limit: 3, filterBy: null },
  { limit: 3 },
]) {
  const j = await fetch("https://api.protonradio.com/graphql", {
    method: "POST",
    headers: h,
    body: JSON.stringify({ query: q1, variables: vars, operationName: "A" }),
  }).then((r) => r.json());
  console.log(JSON.stringify(vars), j.errors?.[0]?.message ?? "OK", j.data?.radioMixes?.edges?.length);
}
