import type { OverviewWarehouseCost } from "@/types/overview.type";
import { formatCurrency, formatPercent } from "@/utils/format";

type Props = {
  rows: OverviewWarehouseCost[];
};

export function WarehouseStructureCard({ rows }: Props) {
  return (
    <section className="h-[420px] overflow-hidden rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold">Cost Structure by Warehouse</h2>

      <div className="max-h-[350px] space-y-3 overflow-y-auto pr-1">
        {rows.map((row) => {
          const percent = Number(row.cost_ratio ?? 0) * 100;

          return (
            <div key={row.warehouse_code} className="space-y-1">
              <div className="flex justify-between gap-3 text-sm">
                <span className="truncate">
                  {row.warehouse_name ?? row.warehouse_code}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPercent(row.cost_ratio)}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>

              <p className="text-xs text-slate-500">
                {formatCurrency(row.total_cost)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
