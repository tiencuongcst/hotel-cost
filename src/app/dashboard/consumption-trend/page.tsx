// src/app/dashboard/consumption-trend/page.tsx

import { ConsumptionTopItemsChart } from "@/components/charts/consumption-top-items-chart";
import { ConsumptionTrendFilters } from "@/components/filters/consumption-trend-filters";
import {
  getConsumptionTrend,
  getConsumptionTrendFilterOptions,
} from "@/modules/consumption-trend/consumption-trend.service";
import type { ConsumptionDetailRow } from "@/modules/consumption-trend/consumption-trend.type";
import { WarehouseCostTrendChart } from "@/components/charts/warehouse-cost-trend-chart";

type PageProps = {
  searchParams?: Promise<{
    used_month?: string;
    hotel_code?: string;
    warehouse_code?: string;
    guest_method?: string;
  }>;
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  const percentValue = Math.abs(value) <= 1 ? value * 100 : value;
  return `${percentValue >= 0 ? "+" : ""}${percentValue.toFixed(2)}%`;
}

export default async function ConsumptionTrendPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const [data, filterOptions] = await Promise.all([
    getConsumptionTrend({
      used_month: params?.used_month,
      hotel_code: params?.hotel_code,
      warehouse_code: params?.warehouse_code,
      guest_method: params?.guest_method ?? "total_guests",
    }),
    getConsumptionTrendFilterOptions(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <header className="border-b border-slate-200 pb-3">
          <h1 className="text-xl font-semibold text-slate-950">
            Consumption Trend
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor item consumption, warehouse cost movement, and abnormal cost
            behavior.
          </p>
        </header>

        <ConsumptionTrendFilters options={filterOptions} />

        <section className="grid gap-3 md:grid-cols-4">
          <KpiCard
            label="Current Cost"
            value={formatMoney(data.kpis.current_cost)}
            subValue="Total consumption cost"
          />
          <KpiCard
            label="MoM Change"
            value={formatPercent(data.kpis.mom_change_percent)}
            subValue="vs previous month"
          />
          <KpiCard
            label="YoY Change"
            value={formatPercent(data.kpis.yoy_change_percent)}
            subValue="vs last year"
          />
          <KpiCard
            label="Cost / Guest"
            value={formatMoney(data.kpis.current_cost_per_guest)}
            subValue="Selected guest base"
          />
        </section>

        <SectionShell title="Executive Summary">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <ul className="space-y-2 text-sm text-slate-700">
              {data.insight_summary.executive_summary.map((item: string) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="text-sm font-semibold text-amber-900">
                Recommended Actions
              </div>
              <ul className="mt-2 space-y-1 text-sm text-amber-800">
                {data.insight_summary.recommended_actions.map(
                  (item: string) => (
                    <li key={item}>• {item}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </SectionShell>

        <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <SectionShell title="Item Trend Analysis">
            <div className="space-y-3 text-sm">
              <InsightRow
                label="Highest Cost Item"
                value={data.item_insight.highest_cost_item}
              />
              <InsightRow
                label="Largest Increase"
                value={data.item_insight.largest_increase_item}
              />
              <InsightRow
                label="Largest Decrease"
                value={data.item_insight.largest_decrease_item}
              />
              <InsightRow
                label="Most Stable Item"
                value={data.item_insight.most_stable_item}
              />
              <InsightRow
                label="Selected Item Count"
                value={String(data.item_insight.selected_item_count)}
              />
            </div>
          </SectionShell>

          <SectionShell title="Top 10 Cost Items">
            <ConsumptionTopItemsChart rows={data.details} />
          </SectionShell>
        </section>

        <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <SectionShell title="Warehouse Trend Analysis">
            <div className="space-y-3 text-sm">
              <InsightRow
                label="Highest Cost Warehouse"
                value={data.warehouse_insight.highest_cost_warehouse}
              />
              <InsightRow
                label="Lowest Cost Warehouse"
                value={data.warehouse_insight.lowest_cost_warehouse}
              />
              <InsightRow
                label="Top Growth Warehouse"
                value={data.warehouse_insight.top_growth_warehouse}
              />
              <InsightRow
                label="Top Reduction Warehouse"
                value={data.warehouse_insight.top_reduction_warehouse}
              />
              <InsightRow
                label="Cost Concentration"
                value={`${data.warehouse_insight.cost_concentration_percent.toFixed(
                  2
                )}%`}
              />
            </div>
          </SectionShell>

          <SectionShell title="Warehouse Cost Trend">
  <WarehouseCostTrendChart
    rows={data.warehouse_trend}
  />
</SectionShell>
        </section>

        <SectionShell title="Consumption Detail Table">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Warehouse</th>
                  <th className="px-3 py-2 text-right">Current Cost</th>
                  <th className="px-3 py-2 text-right">MoM</th>
                  <th className="px-3 py-2 text-right">YoY</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.details.map((row: ConsumptionDetailRow) => (
                  <tr key={row.item_code} className="border-b border-slate-100">
                    <td className="px-3 py-2">{row.item_name}</td>
                    <td className="px-3 py-2">{row.warehouse_code}</td>
                    <td className="px-3 py-2 text-right">
                      {formatMoney(row.current_cost)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatPercent(row.mom_change_percent)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatPercent(row.yoy_change_percent)}
                    </td>
                    <td className="px-3 py-2">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionShell>
      </div>
    </main>
  );
}

function KpiCard({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs font-medium uppercase text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{subValue}</div>
    </div>
  );
}

function SectionShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}