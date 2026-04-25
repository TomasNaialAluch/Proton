"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Download, ChevronRight, Music2,
  Store, DollarSign, AlertTriangle, FileText,
} from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import { mockRoyalties, mockStatements, payoutConfig } from "@/lib/mock/royalties";

const PRO_USER_ID = 67325;

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtMoney(n: number) {
  if (n === 0) return "$0";
  if (n < 0.01) return "$0.00*";
  return `$${fmt(n)}`;
}

export default function StatementDetailPage({
  params,
}: {
  params: Promise<{ qid: string }>;
}) {
  const { qid: qidStr } = use(params);
  const qid = parseInt(qidStr, 10);

  const royalty  = mockRoyalties.find((r) => r.qid === qid);
  const statement = mockStatements[qid];

  if (!royalty) notFound();

  const hasDetail = !!statement;

  const trackTotals = statement
    ? {
        sold: statement.trackEntries.reduce((s, t) => s + t.sold, 0),
        streams: statement.trackEntries.reduce((s, t) => s + t.streams, 0),
        royalties: statement.trackEntries.reduce((s, t) => s + t.royaltyAmount, 0),
      }
    : null;

  const storeTotals = statement
    ? {
        sold: statement.stores.reduce((s, t) => s + t.sold, 0),
        streams: statement.stores.reduce((s, t) => s + t.streams, 0),
        royalties: statement.stores.reduce((s, t) => s + t.royalties, 0),
      }
    : null;

  const totalExpenses = statement
    ? statement.expenses.reduce((s, e) => s + e.amount, 0)
    : 0;

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard",  href: "/dashboard" },
        { label: "Royalties",  href: "/dashboard/royalties" },
        { label: royalty.period },
      ]} />

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{royalty.period} Statement</h1>
          <p className="text-sm text-text-secondary mt-1">{royalty.dateRange}</p>
        </div>
        <a
          href={`https://soundsystem.protonradio.com/statementCSVDownload.php?id=${PRO_USER_ID}&qid=${qid}&type=rev_report`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
            bg-accent/10 text-accent hover:bg-accent/20 transition-colors shrink-0"
        >
          <Download size={14} /> CSV
        </a>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface rounded-xl border border-[var(--color-border)] px-4 py-3">
          <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Monto</p>
          <p className="text-xl font-bold text-text-primary tabular-nums">${fmt(royalty.amount)}</p>
          <p className="text-[11px] text-text-secondary mt-0.5">{royalty.currency}</p>
        </div>
        <div className="bg-surface rounded-xl border border-[var(--color-border)] px-4 py-3">
          <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Estado</p>
          <p className="text-sm font-bold text-amber-500">WITHHELD</p>
          <p className="text-[11px] text-text-secondary mt-0.5">Retenido</p>
        </div>
        <div className="bg-surface rounded-xl border border-[var(--color-border)] px-4 py-3">
          <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Pago vía</p>
          <p className="text-sm font-bold text-accent">{payoutConfig.token}</p>
          <p className="text-[11px] text-text-secondary mt-0.5">{payoutConfig.paymentMethod}</p>
        </div>
      </div>

      {!hasDetail && (
        <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-8 text-center">
          <FileText size={32} className="mx-auto text-text-secondary opacity-40 mb-3" />
          <p className="text-sm font-medium text-text-primary mb-1">Detalle no disponible</p>
          <p className="text-xs text-text-secondary mb-4">
            El desglose completo de este statement no está disponible localmente.<br />
            Podés descargarlo directamente desde Proton SoundSystem.
          </p>
          <a
            href={`https://soundsystem.protonradio.com/statementCSVDownload.php?id=${PRO_USER_ID}&qid=${qid}&type=rev_report`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            <Download size={14} /> Descargar CSV
          </a>
        </div>
      )}

      {hasDetail && (
        <div className="space-y-6">

          {/* ── Release Summary ── */}
          <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
              <Music2 size={14} className="text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Release Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-border)]/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Release</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Vendidos Q</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Streams Q</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary hidden lg:table-cell">Vendidos Total</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary hidden lg:table-cell">Streams Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {statement.releases.map((rel) => (
                    <tr key={rel.name} className="hover:bg-[var(--color-border)]/20 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-sm text-text-primary font-medium">{rel.name}</p>
                        <p className="text-xs text-text-secondary">{rel.trackCount} tracks</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-text-primary">{rel.soldThisQuarter}</td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-text-primary">{fmt(rel.streamedThisQuarter, 0)}</td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-text-secondary hidden lg:table-cell">{rel.soldTotal}</td>
                      <td className="px-5 py-3 text-right text-sm tabular-nums text-text-secondary hidden lg:table-cell">{fmt(rel.streamedTotal, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Track Sales & Streams ── */}
          <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
              <DollarSign size={14} className="text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Track Sales &amp; Streams</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-border)]/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Track</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Vendidos</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Streams</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary hidden lg:table-cell">Store</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary hidden lg:table-cell">Tu %</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Royalties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {statement.trackEntries.map((t, i) => (
                    <tr key={i} className="hover:bg-[var(--color-border)]/20 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-sm text-text-primary leading-snug">{t.trackTitle}</p>
                        <p className="text-xs text-text-secondary lg:hidden">{t.store} · {t.royaltyPercent}%</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-text-primary">{t.sold || "—"}</td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-text-primary">{t.streams ? fmt(t.streams, 0) : "—"}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary hidden lg:table-cell">{t.store}</td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-xs font-semibold text-accent">{t.royaltyPercent}%</span>
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-medium tabular-nums text-text-primary">
                        {fmtMoney(t.royaltyAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[var(--color-border)] bg-[var(--color-border)]/20">
                    <td className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Total</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums text-text-primary">{trackTotals!.sold}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums text-text-primary">{fmt(trackTotals!.streams, 0)}</td>
                    <td className="hidden lg:table-cell" />
                    <td className="hidden lg:table-cell" />
                    <td className="px-5 py-3 text-right text-sm font-bold tabular-nums text-text-primary">
                      ${fmt(trackTotals!.royalties)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* ── Stores & Services ── */}
          <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
              <Store size={14} className="text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Stores &amp; Services</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-border)]/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Store</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Vendidos</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Streams</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Royalties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {statement.stores.map((s) => (
                    <tr key={s.name} className="hover:bg-[var(--color-border)]/20 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-text-primary">{s.name}</td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-text-primary">{s.sold || "—"}</td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-text-primary">{s.streams ? fmt(s.streams, 0) : "—"}</td>
                      <td className="px-5 py-3 text-right text-sm font-medium tabular-nums text-text-primary">
                        {fmtMoney(s.royalties)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[var(--color-border)] bg-[var(--color-border)]/20">
                    <td className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Total</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums text-text-primary">{storeTotals!.sold}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums text-text-primary">{fmt(storeTotals!.streams, 0)}</td>
                    <td className="px-5 py-3 text-right text-sm font-bold tabular-nums text-text-primary">
                      ${fmt(storeTotals!.royalties)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* ── Advance & Expense Debits ── */}
          {statement.expenses.length > 0 && (
            <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
                <AlertTriangle size={14} className="text-amber-500" />
                <h2 className="text-sm font-semibold text-text-primary">Advance &amp; Expense Debits</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-border)]/20">
                      <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Catálogo</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Track</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary hidden lg:table-cell">Concepto</th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {statement.expenses.map((e, i) => (
                      <tr key={i} className="hover:bg-[var(--color-border)]/20 transition-colors">
                        <td className="px-5 py-3">
                          <span className="text-xs font-mono bg-[var(--color-border)] px-2 py-0.5 rounded text-text-secondary">
                            {e.catalog}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-primary">{e.trackName}</td>
                        <td className="px-4 py-3 text-xs text-text-secondary hidden lg:table-cell">{e.info}</td>
                        <td className="px-5 py-3 text-right text-sm font-medium tabular-nums text-amber-500">
                          -${fmt(e.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[var(--color-border)] bg-[var(--color-border)]/20">
                      <td colSpan={3} className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Total debits</td>
                      <td className="px-5 py-3 text-right text-sm font-bold tabular-nums text-amber-500">
                        -${fmt(totalExpenses)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="px-5 py-4 bg-amber-500/5 border-t border-amber-500/20">
                <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                  Los gastos de mastering, diseño y promoción son descontados de tus royalties acumuladas.
                  Las tarifas se aplican por release y se recuperan antes del pago.
                </p>
              </div>
            </section>
          )}

          {/* ── Back link ── */}
          <div className="flex justify-center pt-2">
            <Link
              href="/dashboard/royalties"
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronRight size={14} className="rotate-180" />
              Volver al historial
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
