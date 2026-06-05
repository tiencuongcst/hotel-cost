"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CostTrendRow } from "@/modules/cost-trend/cost-trend.type";

type Props = {
  rows: CostTrendRow[];
};

function formatMonth(value: string) {
  return value.slice(0, 7);
}

function formatMoney(value: number) {
  return Number(value ?? 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  });
}

export function MonthlyCostMiniChart({ rows }: Props) {
  const data = rows.map((row) => ({
    used_month: formatMonth(row.used_month),
    total_cost: Number(row.total_cost ?? 0),
  }));

  return (
    <section className="h-[420px] rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold">Monthly Cost Trend</h2>

      <div className="h-[350px] min-h-[350px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{
              top: 8,
              right: 20,
              left: 30,
              bottom: 16,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="used_month" tick={{ fontSize: 12 }} />
            <YAxis
              width={95}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatMoney(Number(value))}
            />
            <Tooltip formatter={(value) => formatMoney(Number(value))} />
            <Line
              type="monotone"
              dataKey="total_cost"
              name="Total Cost"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
