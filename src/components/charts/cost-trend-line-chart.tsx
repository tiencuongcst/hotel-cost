"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type {
  CostTrendRow,
  WarehouseTrendRow,
} from "@/modules/cost-trend/cost-trend.type";

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
  monthlyRows: CostTrendRow[];
  warehouseRows: WarehouseTrendRow[];
  warehouseCode?: string | null;
};

function formatMonth(value: string) {
  return value.slice(0, 7);
}

function formatMoney(value: number) {
  return Number(value ?? 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  });
}

function buildMultiLineData(rows: WarehouseTrendRow[]) {
  const monthMap = new Map<string, Record<string, string | number>>();

  rows.forEach((row) => {
    const month = formatMonth(row.used_month);

    if (!monthMap.has(month)) {
      monthMap.set(month, { used_month: month });
    }

    monthMap.get(month)![row.warehouse_code] = Number(row.total_cost ?? 0);
  });

  return Array.from(monthMap.values());
}

export function CostTrendLineChart({
  monthlyRows,
  warehouseRows,
  warehouseCode,
}: Props) {
  const isWarehouseSelected = Boolean(warehouseCode);

  const chartData = isWarehouseSelected
    ? monthlyRows.map((row) => ({
        used_month: formatMonth(row.used_month),
        total_cost: Number(row.total_cost ?? 0),
      }))
    : buildMultiLineData(warehouseRows);

  const warehouseCodes = Array.from(
    new Set(warehouseRows.map((row) => row.warehouse_code))
  );

  return (
    <section className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold">
        {isWarehouseSelected ? "Monthly Cost Trend" : "Warehouse Cost Trend"}
      </h2>

      <div className="h-[420px] min-h-[420px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData} margin={{ top: 10, right: 24, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="used_month" />
            <YAxis
              width={120}
              tickFormatter={(value) => formatMoney(Number(value))}
            />
            <Tooltip formatter={(value) => formatMoney(Number(value))} />
            <Legend />

            {isWarehouseSelected ? (
              <Line
                type="monotone"
                dataKey="total_cost"
                name={warehouseCode ?? "Total Cost"}
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            ) : (
              warehouseCodes.map((code, index) => (
                <Line
                  key={code}
                  type="monotone"
                  dataKey={code}
                  name={code}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={3}
                  dot={false}
                />
              ))
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
