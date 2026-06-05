"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CostTrendItemRow } from "@/modules/cost-trend/cost-trend.type";

const COLORS = [
  "#2563eb",
  "#dc2626",
  "#f59e0b",
  "#16a34a",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#475569",
];

type Props = {
  rows: CostTrendItemRow[];
};

function formatMonth(value: string) {
  return value.slice(0, 7);
}

function formatMoney(value: number) {
  return Number(value ?? 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  });
}

function buildItemTrendData(rows: CostTrendItemRow[]) {
  const monthMap = new Map<string, Record<string, string | number>>();

  rows.forEach((row) => {
    const month = formatMonth(row.used_month);
    const itemName = row.item_name ?? row.item_code;

    if (!monthMap.has(month)) {
      monthMap.set(month, { used_month: month });
    }

    monthMap.get(month)![itemName] = Number(row.total_cost ?? 0);
  });

  return Array.from(monthMap.values());
}

export function ItemTrendLineChart({ rows }: Props) {
  const itemNames = Array.from(
    new Set(rows.map((row) => row.item_name ?? row.item_code))
  );

  const data = buildItemTrendData(rows);

  return (
    <section className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold">Selected Item Trend</h2>

      {itemNames.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">
          Select item(s) below to view item trend
        </div>
      ) : (
        <div className="h-[420px] min-h-[420px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={data} margin={{ top: 10, right: 24, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="used_month" />
              <YAxis
                width={120}
                tickFormatter={(value) => formatMoney(Number(value))}
              />
              <Tooltip formatter={(value) => formatMoney(Number(value))} />
              <Legend />

              {itemNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  name={name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={3}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
