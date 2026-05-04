"use client";

/** Resalta la primera aparición del término (case-insensitive), sin HTML crudo. */
export default function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const low = text.toLowerCase();
  const nq = q.toLowerCase();
  const pos = low.indexOf(nq);
  if (pos === -1) return <>{text}</>;

  const before = text.slice(0, pos);
  const match = text.slice(pos, pos + q.length);
  const after = text.slice(pos + q.length);

  return (
    <>
      {before}
      <mark
        className="bg-transparent font-semibold"
        style={{ color: "var(--color-accent)" }}
      >
        {match}
      </mark>
      {after}
    </>
  );
}
