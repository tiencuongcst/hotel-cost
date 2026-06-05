"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import styles from "@/modules/guest-efficiency/guest-efficiency.module.css";
import { GuestEfficiencyChartPoint } from "@/modules/guest-efficiency/guest-efficiency.type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler
);

type GuestCostTrendChartProps = {
  title: string;
  data: GuestEfficiencyChartPoint[];
};

export function GuestCostTrendChart({
  title,
  data,
}: GuestCostTrendChartProps) {
  const useSmoothLine = data.length > 4;

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{title}</div>

      <div className={styles.chartBox}>
        <Line
          data={{
            labels: data.map((item) => item.period),
            datasets: [
              {
                data: data.map((item) => item.value),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.08)",
                borderWidth: 2,
                tension: useSmoothLine ? 0.35 : 0,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: "#2563eb",
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${Number(context.raw).toLocaleString("en-US")} VND`,
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#64748b",
                },
              },
              y: {
                grid: {
                  color: "#e2e8f0",
                },
                ticks: {
                  color: "#64748b",
                  callback: (value) => Number(value).toLocaleString("en-US"),
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}