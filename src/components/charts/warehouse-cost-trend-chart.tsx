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
import type { WarehouseTrendRow } from "@/modules/cost-trend/cost-trend.type";

type Props = {
  rows: WarehouseTrendRow[];
};

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#9333ea", "#dc2626"];

function formatMoney(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function WarehouseCostTrendChart({ rows }: Props) {
  const latestMonth = [...rows]
    .map((row) => row.used_month)
    .sort((a, b) => b.localeCompare(a))[0];

  const topWarehouses = [...rows]
    .filter((row) => row.used_month === latestMonth)
    .sort((a, b) => b.total_cost - a.total_cost)
    .slice(0, 5)
    .map((row) => row.warehouse_code);

  const months = Array.from(new Set(rows.map((row) => row.used_month))).sort();

  const chartData = months.map((month) => {
    const rowData: Record<string, string | number> = {
      used_month: month.slice(0, 7),
    };

    topWarehouses.forEach((warehouseCode) => {
      const matchedRow = rows.find(
        (row) =>
          row.used_month === month && row.warehouse_code === warehouseCode
      );

      rowData[warehouseCode] = matchedRow?.total_cost ?? 0;
    });

    return rowData;
  });

  if (rows.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        No warehouse trend data available.
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" />
          <XAxis dataKey="used_month" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}M`}
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip formatter={(value) => formatMoney(Number(value))} />
          <Legend wrapperStyle={{ fontSize: 12 }} />

          {topWarehouses.map((warehouseCode, index) => (
            <Line
              key={warehouseCode}
              type={chartData.length < 4 ? "linear" : "monotone"}
              dataKey={warehouseCode}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}