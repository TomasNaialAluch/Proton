const h = {
  "Content-Type": "application/json",
  origin: "https://www.protonradio.com",
  referer: "https://www.protonradio.com/",
};

const query = `
query LatestRadioMixes {
  radioMixes(last: 12) {
    edges {
      node {
        id
        slug
        partNumber
        youtubeId
        showDate { date }
        artist { id name image { url } }
        show { id name slug }
      }
    }
  }
}
`;

const j = await fetch("https://api.protonradio.com/graphql", {
  method: "POST",
  headers: h,
  body: JSON.stringify({ query, operationName: "LatestRadioMixes" }),
}).then((r) => r.json());

console.log(JSON.stringify(j, null, 2));
