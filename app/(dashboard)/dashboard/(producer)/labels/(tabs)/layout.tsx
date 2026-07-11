import LabelsTabs from "@/components/dashboard/producer/labels/LabelsTabs";

export default function LabelsTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">
      <LabelsTabs />
      {children}
    </main>
  );
}
