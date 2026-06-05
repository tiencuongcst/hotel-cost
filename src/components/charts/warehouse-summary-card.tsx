import type { WarehouseTrendRow } from "@/modules/cost-trend/cost-trend.type";
import { formatCurrency, formatPercent } from "@/utils/format";

type Props = {
  rows: WarehouseTrendRow[];
  usedMonth?: string | null;
};

function getMonth(value: string) {
  return value.slice(0, 10);
}

function getPreviousMonth(value: string) {
  const date = new Date(value);
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().slice(0, 10);
}

export function WarehouseSummaryCard({ rows, usedMonth }: Props) {
  const selectedMonth =
    usedMonth ?? rows.map((row) => row.used_month).sort().at(-1) ?? null;

  const previousMonth = selectedMonth ? getPreviousMonth(selectedMonth) : null;

  const currentRows = rows.filter(
    (row) => selectedMonth && getMonth(row.used_month) === selectedMonth
  );

  const previousRows = rows.filter(
    (row) => previousMonth && getMonth(row.used_month) === previousMonth
  );

  const previousMap = new Map(
    previousRows.map((row) => [row.warehouse_code, Number(row.total_cost ?? 0)])
  );

  const highest = [...currentRows].sort(
    (a, b) => Number(b.total_cost ?? 0) - Number(a.total_cost ?? 0)
  )[0];

  const lowest = [...currentRows].sort(
    (a, b) => Number(a.total_cost ?? 0) - Number(b.total_cost ?? 0)
  )[0];

  const growthRows = currentRows.map((row) => {
    const current = Number(row.total_cost ?? 0);
    const previous = previousMap.get(row.warehouse_code) ?? 0;

    return {
      warehouse_code: row.warehouse_code,
      growth:
        previous > 0
          ? (current - previous) / previous
          : 0,
    };
  });

  const topGrowth = [...growthRows].sort((a, b) => b.growth - a.growth)[0];
  const topDecrease = [...growthRows].sort((a, b) => a.growth - b.growth)[0];

  return (
    <section className="h-[360px] rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold">Warehouse Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between border-b pb-3">
          <span className="text-slate-500">Highest Cost</span>
          <span className="font-semibold">
            {highest?.warehouse_code ?? "-"} · {formatCurrency(highest?.total_cost)}
          </span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="text-slate-500">Lowest Cost</span>
          <span className="font-semibold">
            {lowest?.warehouse_code ?? "-"} · {formatCurrency(lowest?.total_cost)}
          </span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="text-slate-500">Top Growth MoM</span>
          <span className="font-semibold text-red-600">
            {topGrowth?.warehouse_code ?? "-"} · {formatPercent(topGrowth?.growth)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Top Decrease MoM</span>
          <span className="font-semibold text-green-600">
            {topDecrease?.warehouse_code ?? "-"} · {formatPercent(topDecrease?.growth)}
          </span>
        </div>
      </div>
    </section>
  );
}
