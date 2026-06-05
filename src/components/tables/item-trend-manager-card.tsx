"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CostTrendItemOption } from "@/modules/cost-trend/cost-trend.type";

type Props = {
  rows: CostTrendItemOption[];
};

function getSelectedItems(value: string | null) {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function ItemTrendManagerCard({ rows }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedItems = getSelectedItems(searchParams.get("item_codes"));

  function updateItems(nextItems: string[]) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextItems.length === 0) {
      params.delete("item_codes");
    } else {
      params.set("item_codes", nextItems.join(","));
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleItem(itemCode: string) {
    const current = new Set(selectedItems);

    if (current.has(itemCode)) {
      current.delete(itemCode);
    } else {
      current.add(itemCode);
    }

    updateItems(Array.from(current));
  }

  return (
    <section className="h-[420px] rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Manage Items for Trend</h2>
          <p className="text-xs text-slate-500">
            Select item codes from current filter
          </p>
        </div>

        <button
          type="button"
          onClick={() => updateItems([])}
          className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
        >
          Clear
        </button>
      </div>

      <div className="mb-3 rounded-lg border bg-slate-50 px-3 py-2 text-xs text-slate-500">
        {selectedItems.length} item(s) selected
      </div>

      <div className="max-h-[295px] space-y-2 overflow-y-auto pr-1">
        {rows.map((row) => {
          const checked = selectedItems.includes(row.item_code);

          return (
            <label
              key={row.item_code}
              className="flex cursor-pointer items-start gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(row.item_code)}
                className="mt-1 h-4 w-4"
              />

              <span className="leading-5">
                {row.item_name ?? row.item_code}
                <span className="block text-xs text-slate-400">
                  {row.item_code}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
