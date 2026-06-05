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

import type {
  ConsumptionDetailRow,
} from "@/modules/consumption-trend/consumption-trend.type";

type Props = {
  rows: ConsumptionDetailRow[];
};

function truncateLabel(value: string) {
  if (value.length <= 24) return value;
  return `${value.slice(0, 24)}...`;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function ConsumptionTopItemsChart({
  rows,
}: Props) {
  const data = rows
    .slice(0, 10)
    .map((row) => ({
      itemName: row.item_name,
      shortName: truncateLabel(row.item_name),
      cost: Number(row.current_cost),
    }));

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 8,
            right: 24,
            left: 12,
            bottom: 8,
          }}
        >
          <CartesianGrid strokeDasharray="2 2" />

          <XAxis
            type="number"
            tickFormatter={(value) =>
              `${Math.round(Number(value) / 1000000)}M`
            }
          />

          <YAxis
            type="category"
            dataKey="shortName"
            width={180}
            interval={0}
            tick={{
              fontSize: 12,
            }}
          />

          <Tooltip
            formatter={(value) =>
              formatMoney(Number(value))
            }
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.itemName ?? ""
            }
          />

          <Bar
            dataKey="cost"
            fill="#2563eb"
            radius={[0, 4, 4, 0]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}