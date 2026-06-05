"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CostTrendItemOption } from "@/modules/cost-trend/cost-trend.type";
import { formatCurrency, formatNumber } from "@/utils/format";

type Props = {
  rows: CostTrendItemOption[];
};

function getSelectedItems(value: string | null) {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function ItemSelectorTable({ rows }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedItems = getSelectedItems(searchParams.get("item_codes"));

  function toggleItem(itemCode: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(selectedItems);

    if (current.has(itemCode)) {
      current.delete(itemCode);
    } else {
      current.add(itemCode);
    }

    const nextValue = Array.from(current);

    if (nextValue.length === 0) {
      params.delete("item_codes");
    } else {
      params.set("item_codes", nextValue.join(","));
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="font-semibold">Item Selection for Trend</h2>
        <p className="text-xs text-slate-500">
          Sorted by selected month total cost descending
        </p>
      </div>

      <div className="max-h-[520px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-100">
            <tr>
              <th className="w-12 px-3 py-1 text-left">Pick</th>
              <th className="px-3 py-1 text-left">Item Code</th>
              <th className="px-3 py-1 text-left">Item Name</th>
              <th className="px-3 py-1 text-left">Unit</th>
              <th className="px-3 py-1 text-right">Quantity</th>
              <th className="px-3 py-1 text-right">Avg Price</th>
              <th className="px-3 py-1 text-right">Total Cost</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const checked = selectedItems.includes(row.item_code);

              return (
                <tr key={row.item_code} className="border-t hover:bg-slate-50">
                  <td className="px-3 py-1">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(row.item_code)}
                      className="h-3.5 w-3.5"
                    />
                  </td>

                  <td className="px-3 py-1">{row.item_code}</td>
                  <td className="px-3 py-1">{row.item_name ?? "-"}</td>
                  <td className="px-3 py-1">{row.unit ?? "-"}</td>
                  <td className="px-3 py-1 text-right">{formatNumber(row.total_quantity, 2)}</td>
                  <td className="px-3 py-1 text-right">{formatCurrency(row.avg_unit_price)}</td>
                  <td className="px-3 py-1 text-right font-medium">{formatCurrency(row.total_cost)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
