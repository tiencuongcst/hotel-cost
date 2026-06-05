import { OverviewFilters } from "@/components/filters/overview-filters";
import { KpiCard } from "@/components/kpi/kpi-card";
import { TopItemsBarChart } from "@/components/charts/top-items-bar-chart";
import { WarehouseStructureCard } from "@/components/charts/warehouse-structure-card";
import { MonthlyCostMiniChart } from "@/components/charts/monthly-cost-mini-chart";
import { ItemDetailTable } from "@/components/tables/item-detail-table";
import {
  getOverview,
  getOverviewFilterOptions,
} from "@/services/overview.service";
import { getCostTrend } from "@/modules/cost-trend/cost-trend.service";
import type { GuestMethod } from "@/types/overview.type";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/format";

type PageProps = {
  searchParams: Promise<{
    used_month?: string;
    hotel_code?: string;
    warehouse_code?: string;
    guest_method?: GuestMethod;
  }>;
};

export default async function OverviewPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const [overview, trend, filterOptions] = await Promise.all([
    getOverview({
      used_month: params.used_month,
      hotel_code: params.hotel_code,
      warehouse_code: params.warehouse_code,
      guest_method: params.guest_method ?? "total_guests",
    }),
    getCostTrend({
      used_month: params.used_month,
      hotel_code: params.hotel_code,
      warehouse_code: params.warehouse_code,
      guest_method: params.guest_method ?? "total_guests",
    }),
    getOverviewFilterOptions(),
  ]);

  const kpis = overview.kpis;
  const topItem = overview.top_items[0];

  return (
    <main className="space-y-5 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Cost Controller Hub
          </h1>
          <p className="text-sm text-slate-500">Overview Dashboard</p>
        </div>

        <p className="text-xs text-slate-500">
          Last updated from Supabase
        </p>
      </div>

      <OverviewFilters options={filterOptions} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Cost"
          value={formatCurrency(kpis.total_cost)}
          subtitle="Total F&B Cost"
        />

        <KpiCard
          title="Total Items Quantity"
          value={formatNumber(kpis.total_quantity, 2)}
          subtitle="Total Items Issued"
        />

        <KpiCard
          title="Highest Cost Item"
          value={topItem?.item_name ?? "-"}
          subtitle={topItem ? formatCurrency(topItem.total_cost) : "-"}
        />

        <KpiCard
          title="Cost Ratio"
          value={formatPercent(kpis.cost_ratio)}
          subtitle="Cost / Revenue"
        />
      </section>

      <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <TopItemsBarChart rows={overview.top_items} />
        </div>

        <div className="xl:col-span-3">
          <WarehouseStructureCard rows={overview.cost_by_warehouse} />
        </div>

        <div className="xl:col-span-4">
          <MonthlyCostMiniChart rows={trend.monthly_trend} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          title="Cost / Guest"
          value={formatCurrency(kpis.cost_per_guest)}
          subtitle={kpis.guest_method}
        />

        <KpiCard
          title="Cost / Room Night"
          value={formatCurrency(kpis.cost_per_room_night)}
          subtitle="Total cost / room nights"
        />

        <KpiCard
          title="Guest Base"
          value={formatNumber(kpis.selected_guest_base)}
          subtitle="Selected guest method"
        />
      </section>

      <ItemDetailTable rows={overview.top_items} />
    </main>
  );
}
