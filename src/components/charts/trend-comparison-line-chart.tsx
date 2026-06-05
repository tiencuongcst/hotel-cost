'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: any[];
}

function formatMonth(value: string) {
  return value ? value.slice(0, 7) : '';
}

function formatVnd(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TrendComparisonLineChart({ data }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-4 font-semibold">
        12-Month Trend Comparison
      </h3>

      <div className="h-[520px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 30,
              right: 130,
              left: 90,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="used_month"
              tickFormatter={formatMonth}
              label={{
                value: 'Month',
                position: 'insideBottom',
                offset: -15,
              }}
            />

            <YAxis
              yAxisId="revenue"
              orientation="left"
              tickFormatter={(value) => formatVnd(Number(value))}
              width={100}
              stroke="#2563eb"
              label={{
                value: 'VND',
                position: 'insideTopLeft',
                fill: '#2563eb',
              }}
            />

            <YAxis
              yAxisId="adr"
              orientation="right"
              tickFormatter={(value) => formatVnd(Number(value))}
              width={90}
              stroke="#16a34a"
              label={{
                value: 'VND/Room',
                position: 'insideTopRight',
                fill: '#16a34a',
              }}
            />

            <YAxis
              yAxisId="cost"
              orientation="right"
              tickFormatter={(value) => formatVnd(Number(value))}
              width={100}
              stroke="#ef4444"
              label={{
                value: 'Cost VND',
                position: 'insideTopRight',
                fill: '#ef4444',
              }}
            />

            <Tooltip
              labelFormatter={(label) => formatMonth(String(label))}
              formatter={(value, name) => [
                formatVnd(Number(value)),
                name,
              ]}
            />

            <Legend verticalAlign="top" height={40} />

            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              name="Revenue (VND)"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              activeDot={false}
            />

            <Line
              yAxisId="adr"
              type="monotone"
              dataKey="adr"
              name="ADR (VND/Room)"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
              activeDot={false}
            />

            <Area
              yAxisId="cost"
              type="monotone"
              dataKey="warehouse_cost"
              name="Warehouse Cost (VND)"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.12}
              strokeWidth={3}
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}