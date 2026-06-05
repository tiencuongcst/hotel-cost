"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency, formatPercent } from "@/utils/format";

const CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#64748b",
  "#84cc16",
  "#ec4899",
];

export type DonutChartRow = {
  name: string;
  value: number;
  ratio: number;
};

type Props = {
  title: string;
  rows: DonutChartRow[];
};

export function CostStructureDonutChart({ title, rows }: Props) {
  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold">{title}</h2>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value, name, props) => [
                formatCurrency(Number(value)),
                `${name} - ${formatPercent(props.payload.ratio)}`,
              ]}
            />

            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              label={(entry) => formatPercent(entry.ratio)}
            >
              {rows.map((_, index) => (
                <Cell
                  key={index}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
