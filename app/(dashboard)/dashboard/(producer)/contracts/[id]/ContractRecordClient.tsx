"use client";

import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { ShieldCheck, ChevronLeft } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ContractKeyDates from "@/components/dashboard/producer/contracts/ContractKeyDates";
import RealContractViewer from "@/components/dashboard/producer/contracts/RealContractViewer";
import { useContractsStore } from "@/lib/store/contractsStore";

function contractIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/contracts\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Read-only detail for a contract already closed on Proton's real records — no PDF/signature here. */
export default function ContractRecordClient() {
  const pathname = usePathname();
  const id = contractIdFromPath(pathname);
  const contract = useContractsStore((s) => s.contracts.find((c) => c.id === id));

  if (!id) notFound();
  if (!contract) notFound();
  if (!contract.realContractUrl) notFound();

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Contracts", href: "/dashboard/contracts" },
        { label: contract.release },
      ]} />

      <Link
        href="/dashboard/contracts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ChevronLeft size={16} />
        Back to contracts
      </Link>

      <h1 className="text-2xl font-bold text-text-primary mb-0.5">{contract.release}</h1>
      <p className="text-sm text-text-secondary mb-6">{contract.label}</p>

      <div className="space-y-4">
        <RealContractViewer realContractUrl={contract.realContractUrl} />

        <ContractKeyDates dates={contract.keyDates} />

        {contract.signature && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <h2 className="text-sm font-semibold text-text-primary">Signed &amp; verified</h2>
            </div>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              <li>Signed by <span className="font-medium text-text-primary">{contract.signature.signedByName}</span></li>
              <li>Date: <span className="font-medium text-text-primary">{formatDate(contract.signature.signedAt)}</span></li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
