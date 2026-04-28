import { fetchLabels } from "@/lib/api/labels";
import LabelCard from "@/components/public/LabelCard";

export default async function LabelsPage() {
  const labels = await fetchLabels();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold italic"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          Labels
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Record labels distributed through Proton Radio.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {labels.map((label) => (
          <LabelCard key={label.id} label={label} />
        ))}
      </div>

    </div>
  );
}
