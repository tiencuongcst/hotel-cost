import type { OverviewTopItem } from "@/types/overview.type";
import { formatCurrency, formatNumber } from "@/utils/format";

type Props = {
  rows: OverviewTopItem[];
};

export function ItemDetailTable({ rows }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="font-semibold">Item Consumption Detail</h2>
          <p className="text-xs text-slate-500">
            Sorted by total cost descending
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="h-9 w-64 rounded-lg border px-3 text-sm"
            placeholder="Search item..."
            disabled
          />

          <button
            type="button"
            className="h-9 rounded-lg border px-3 text-sm"
            disabled
          >
            Export
          </button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Item Code</th>
            <th className="p-3 text-left">Item Name</th>
            <th className="p-3 text-left">Unit</th>
            <th className="p-3 text-right">Quantity</th>
            <th className="p-3 text-right">Avg Unit Price</th>
            <th className="p-3 text-right">Total Cost</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.item_code} className="border-t hover:bg-slate-50">
              <td className="p-3">{row.item_code}</td>
              <td className="p-3">{row.item_name ?? "-"}</td>
              <td className="p-3">{row.unit ?? "-"}</td>
              <td className="p-3 text-right">{formatNumber(row.total_quantity, 2)}</td>
              <td className="p-3 text-right">{formatCurrency(row.avg_unit_price)}</td>
              <td className="p-3 text-right font-medium">{formatCurrency(row.total_cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
