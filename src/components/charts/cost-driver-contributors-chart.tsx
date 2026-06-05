"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CostDriverItem } from "@/types/cost-drivers";

type Props = {
  rows: CostDriverItem[];
};

export function CostDriverContributorsChart({ rows }: Props) {
  const chartRows = rows.map((row) => ({
    itemName: row.item_name,
    currentCost: row.current_cost,
  }));

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartRows}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 80, bottom: 8 }}
        >
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />

          <XAxis
            type="number"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}M`}
          />

          <YAxis
            type="category"
            dataKey="itemName"
            width={120}
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) =>
              `${Number(value).toLocaleString("vi-VN")} VND`
            }
            contentStyle={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              boxShadow: "none",
            }}
          />

          <Bar dataKey="currentCost" fill="#2563eb" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}