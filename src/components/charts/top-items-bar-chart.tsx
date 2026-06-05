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
import type { OverviewTopItem } from "@/types/overview.type";
import { formatCurrency } from "@/utils/format";

type Props = {
  rows: OverviewTopItem[];
};

function truncateLabel(value: string) {
  if (value.length <= 22) return value;
  return `${value.slice(0, 22)}...`;
}

export function TopItemsBarChart({ rows }: Props) {
  const data = rows.slice(0, 10).map((row) => ({
    name: row.item_name ?? row.item_code,
    shortName: truncateLabel(row.item_name ?? row.item_code),
    cost: Number(row.total_cost ?? 0),
  }));

  return (
    <section className="h-[420px] rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold">Top 10 Cost Items</h2>

      <div className="h-[350px] min-h-[350px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 8,
              right: 24,
              left: 12,
              bottom: 16,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              tickFormatter={(value) =>
                `${Math.round(Number(value) / 1000000)}M`
              }
            />

            <YAxis
              type="category"
              dataKey="shortName"
              width={150}
              tick={{
                fontSize: 12,
              }}
              interval={0}
            />

            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.name ?? ""
              }
            />

            <Bar
              dataKey="cost"
              fill="#3b82f6"
              radius={[0, 6, 6, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
