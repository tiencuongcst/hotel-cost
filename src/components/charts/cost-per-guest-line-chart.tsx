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

export function CostPerGuestLineChart({ rows }: Props) {
  const data = rows.map((row) => ({
    used_month: formatMonth(row.used_month),
    cost_per_guest: Number(row.cost_per_guest ?? 0),
  }));

  return (
    <section className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold">Cost / Guest Trend</h2>

      <div className="h-[360px] min-h-[360px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={data} margin={{ top: 10, right: 24, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="used_month" />
            <YAxis
              width={120}
              tickFormatter={(value) => formatMoney(Number(value))}
            />
            <Tooltip formatter={(value) => formatMoney(Number(value))} />
            <Line
              type="monotone"
              dataKey="cost_per_guest"
              name="Cost / Guest"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
