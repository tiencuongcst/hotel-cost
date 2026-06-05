import { OverviewFilters } from "@/components/filters/overview-filters";
import { KpiCard } from "@/components/kpi/kpi-card";
import { CostTrendLineChart } from "@/components/charts/cost-trend-line-chart";
import { CostPerGuestLineChart } from "@/components/charts/cost-per-guest-line-chart";
import { ItemTrendLineChart } from "@/components/charts/item-trend-line-chart";
import { WarehouseSummaryCard } from "@/components/charts/warehouse-summary-card";
import { ItemSelectorTable } from "@/components/tables/item-selector-table";
import { ItemTrendManagerCard } from "@/components/tables/item-trend-manager-card";
import { getCostTrend } from "@/modules/cost-trend/cost-trend.service";
import { getOverviewFilterOptions } from "@/services/overview.service";
import { formatCurrency, formatPercent } from "@/utils/format";

function parseItemCodes(value?: string) {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function CostTrendPage({
  searchParams,
}: {
  searchParams: Promise<{
    used_month?: string;
    hotel_code?: string;
    warehouse_code?: string;
    guest_method?: string;
    item_codes?: string;
  }>;
}) {
  const params = await searchParams;
  const itemCodes = parseItemCodes(params.item_codes);

  const [data, filterOptions] = await Promise.all([
    getCostTrend({
      used_month: params.used_month,
      hotel_code: params.hotel_code,
      warehouse_code: params.warehouse_code,
      guest_method: params.guest_method,
      item_codes: itemCodes,
    }),
    getOverviewFilterOptions(),
  ]);

  return (
    <main className="space-y-5 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Cost Trend</h1>
          <p className="text-sm text-slate-500">Monthly Cost Analysis</p>
        </div>

        <p className="text-xs text-slate-500">
          Data month: {data.filters.used_month?.slice(0, 7)}
        </p>
      </div>

      <OverviewFilters options={filterOptions} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          title="Current Cost"
          value={formatCurrency(data.kpis.current_total_cost)}
          subtitle="VND"
        />

        <KpiCard
          title="MoM Cost Change"
          value={formatCurrency(data.kpis.mom_change_amount)}
          subtitle={formatPercent(data.kpis.mom_change_percent)}
        />

        <KpiCard
          title="YoY Cost Change"
          value={formatCurrency(data.kpis.yoy_change_amount)}
          subtitle={formatPercent(data.kpis.yoy_change_percent)}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-9">
          <ItemTrendLineChart rows={data.item_trend} />
        </div>

        <div className="xl:col-span-3">
          <ItemTrendManagerCard rows={data.item_options} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-9">
          <CostTrendLineChart
            monthlyRows={data.monthly_trend}
            warehouseRows={data.warehouse_trend}
            warehouseCode={params.warehouse_code ?? null}
          />
        </div>

        <div className="xl:col-span-3">
          <WarehouseSummaryCard
            rows={data.warehouse_trend}
            usedMonth={data.filters.used_month}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="grid grid-cols-1 gap-4 xl:col-span-3">
          <KpiCard
            title="Current Cost / Guest"
            value={formatCurrency(data.kpis.current_cost_per_guest)}
            subtitle="VND"
          />

          <KpiCard
            title="MoM Cost / Guest"
            value={formatCurrency(data.kpis.cost_per_guest_mom_change_amount)}
            subtitle={formatPercent(data.kpis.cost_per_guest_mom_change_percent)}
          />

          <KpiCard
            title="YoY Cost / Guest"
            value={formatCurrency(data.kpis.cost_per_guest_yoy_change_amount)}
            subtitle={formatPercent(data.kpis.cost_per_guest_yoy_change_percent)}
          />
        </div>

        <div className="xl:col-span-9">
          <CostPerGuestLineChart rows={data.monthly_trend} />
        </div>
      </section>

      <ItemSelectorTable rows={data.item_options} />
    </main>
  );
}
