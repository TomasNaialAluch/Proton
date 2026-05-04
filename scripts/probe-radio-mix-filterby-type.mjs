const h = {
  "Content-Type": "application/json",
  origin: "https://www.protonradio.com",
  referer: "https://www.protonradio.com/",
};

const query = `
query {
  __type(name: "RadioMixFilterInput") {
    inputFields { name type { name kind ofType { name kind ofType { name } } } }
  }
}
`;

const j = await fetch("https://api.protonradio.com/graphql", {
  method: "POST",
  headers: h,
  body: JSON.stringify({ query }),
}).then((r) => r.json());

console.log(JSON.stringify(j, null, 2));
