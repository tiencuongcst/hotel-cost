"use client";

import type { AlertByType } from "@/types/alerts";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  data: AlertByType[];
};

const COLORS = ["#ef4444", "#f97316", "#3b82f6", "#22c55e"];

export function AlertsByTypeChart({ data }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-950">
        Alerts by Type
      </h2>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {data.map((item, index) => (
                <Cell
                  key={item.type}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 space-y-2">
        {data.map((item, index) => (
          <div key={item.type} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.type}</span>
            </div>
            <span className="font-medium">
              {item.count} ({item.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}