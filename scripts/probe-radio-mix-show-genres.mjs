const h = {
  "Content-Type": "application/json",
  origin: "https://www.protonradio.com",
  referer: "https://www.protonradio.com/",
};

const query = `
query {
  radioMix(id: "79062") {
    id
    slug
    partNumber
    youtubeId
    showDate { date }
    artist { id name image { url } }
    show {
      id
      name
      slug
      genres { id name }
    }
  }
}
`;

const j = await fetch("https://api.protonradio.com/graphql", {
  method: "POST",
  headers: h,
  body: JSON.stringify({ query }),
}).then((r) => r.json());

console.log(JSON.stringify(j, null, 2));
