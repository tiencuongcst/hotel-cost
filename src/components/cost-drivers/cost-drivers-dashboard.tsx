"use client";

import type { CostDriversRpcResponse } from "@/types/cost-drivers";
import type { CostDriverFilterOptions } from "@/services/cost-drivers";
import { CostDriverContributorsChart } from "@/components/charts/cost-driver-contributors-chart";
import { CostDriverFilters } from "@/components/filters/cost-driver-filters";

type Props = {
  data: CostDriversRpcResponse;
  filterOptions: CostDriverFilterOptions;
  selectedFilters: {
    usedMonth: string;
    hotelCode?: string;
    warehouseCode?: string;
    guestMethod?: string;
  };
};

function formatVnd(value: number | undefined) {
  return `${Math.round(value ?? 0).toLocaleString("vi-VN")} VND`;
}

function formatPercent(value: number | undefined) {
  const percent = (value ?? 0) * 100;
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}%`;
}

export function CostDriversDashboard({
  data,
  filterOptions,
  selectedFilters,
}: Props) {
  const totalIncrease = data.top_cost_increase.reduce(
    (sum, item) => sum + (item.impact_amount ?? 0),
    0
  );

  const totalDecrease = data.top_cost_decrease.reduce(
    (sum, item) => sum + (item.impact_amount ?? 0),
    0
  );

  const topContributor = data.top_contributors[0];

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 text-[#0f172a]">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Cost Drivers</h1>
        <p className="text-sm text-[#64748b]">
          Identify item-level cost increases, decreases, and major contributors
        </p>
      </div>

      <CostDriverFilters
        selectedFilters={selectedFilters}
        options={filterOptions}
      />

      <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <KpiCard
          title="Top Increased Items"
          value={data.top_cost_increase.length}
        />
        <KpiCard
          title="Top Decreased Items"
          value={data.top_cost_decrease.length}
        />
        <KpiCard
          title="Total Increase Impact"
          value={formatVnd(totalIncrease)}
        />
        <KpiCard
          title="Largest Contributor"
          value={topContributor?.item_name ?? "No data"}
        />
      </section>

      <section className="mb-4 rounded-xl border border-[#e2e8f0] bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold">Performance Highlights</h2>
        <div className="space-y-1 text-sm text-[#64748b]">
          <p>Total cost increase impact is {formatVnd(totalIncrease)}.</p>
          <p>Total cost decrease impact is {formatVnd(totalDecrease)}.</p>
          <p>
            Largest contributor is{" "}
            {topContributor?.item_name ?? "not available"}.
          </p>
        </div>
      </section>

      <section className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold">Top Contributors</h2>
          <CostDriverContributorsChart
            rows={data.top_contributors.slice(0, 10)}
          />
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold">Target vs Actual</h2>

          <div className="space-y-3 text-sm">
            <TargetRow
              label="Top Contributor"
              value={topContributor?.item_name ?? "No data"}
            />
            <TargetRow
              label="Current Cost"
              value={formatVnd(topContributor?.current_cost)}
            />
            <TargetRow
              label="Contribution"
              value={formatPercent(topContributor?.contribution_percent)}
            />
            <TargetRow
              label="Status"
              value={
                (topContributor?.contribution_percent ?? 0) > 0.15
                  ? "High Concentration"
                  : "Normal"
              }
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CostDriverTable
          title="Top Cost Increase"
          rows={data.top_cost_increase}
          mode="increase"
        />

        <CostDriverTable
          title="Top Cost Decrease"
          rows={data.top_cost_decrease}
          mode="decrease"
        />
      </section>
    </main>
  );
}

function KpiCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <p className="text-xs text-[#64748b]">{title}</p>
      <p className="mt-2 truncate text-lg font-semibold">{value}</p>
    </div>
  );
}

function TargetRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#e2e8f0] pb-2">
      <span className="text-[#64748b]">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function CostDriverTable({
  title,
  rows,
  mode,
}: {
  title: string;
  rows: CostDriversRpcResponse["top_cost_increase"];
  mode: "increase" | "decrease";
}) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
              <th className="py-2 pr-4 font-medium">Item</th>
              <th className="py-2 pr-4 font-medium">Current Cost</th>
              <th className="py-2 pr-4 font-medium">Previous Cost</th>
              <th className="py-2 pr-4 font-medium">Impact</th>
              <th className="py-2 pr-4 font-medium">Change</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.item_code} className="border-b border-[#e2e8f0]">
                <td className="py-2 pr-4">{row.item_name}</td>
                <td className="py-2 pr-4">{formatVnd(row.current_cost)}</td>
                <td className="py-2 pr-4">{formatVnd(row.previous_cost)}</td>
                <td
                  className={
                    mode === "increase"
                      ? "py-2 pr-4 text-[#dc2626]"
                      : "py-2 pr-4 text-[#16a34a]"
                  }
                >
                  {formatVnd(row.impact_amount)}
                </td>
                <td className="py-2 pr-4">
                  {formatPercent(row.change_percent)}
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-center text-sm text-[#64748b]"
                >
                  No data available
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}