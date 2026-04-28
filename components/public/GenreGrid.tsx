import Link from "next/link";

const GENRES = [
  { label: "All", href: "/shows", color: "#E67E22" },
  { label: "Breaks", href: "/shows?genre=breaks", color: "#9B59B6" },
  { label: "Downtempo", href: "/shows?genre=downtempo", color: "#2980B9" },
  { label: "Deep House", href: "/shows?genre=deep-house", color: "#27AE60" },
  { label: "Electro", href: "/shows?genre=electro", color: "#2471A3" },
  { label: "Electronica", href: "/shows?genre=electronica", color: "#1ABC9C" },
  { label: "Progressive", href: "/shows?genre=progressive", color: "#C0392B" },
  { label: "Tech House", href: "/shows?genre=tech-house", color: "#922B21" },
  { label: "Techno", href: "/shows?genre=techno", color: "#8E44AD" },
];

export default function GenreGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
      {GENRES.map(({ label, href, color }) => (
        <Link
          key={label}
          href={href}
          className="relative h-20 md:h-24 rounded-xl overflow-hidden flex items-end p-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: color }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 100%)" }}
          />
          <span
            className="relative z-10 text-white text-xs font-semibold tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
