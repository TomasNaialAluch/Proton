const PROTON_API = "https://api.protonradio.com/graphql";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "origin": "https://www.protonradio.com",
  "referer": "https://www.protonradio.com/",
};

export async function protonQuery<T>(
  operationName: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(PROTON_API, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ operationName, query, variables }),
    next: { revalidate: 300 }, // cache 5 min
  });

  if (!res.ok) throw new Error(`Proton API error: ${res.status}`);

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);

  return json.data as T;
}
