"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { GuestCostTrendChart } from "@/components/guest-efficiency/guest-cost-trend-chart";
import styles from "@/modules/guest-efficiency/guest-efficiency.module.css";
import {
  GuestEfficiencyDashboardData,
  GuestEfficiencyFilters,
} from "@/modules/guest-efficiency/guest-efficiency.type";

type Props = {
  initialData: GuestEfficiencyDashboardData;
};

function formatVnd(value: number) {
  return `${Math.round(value).toLocaleString("en-US")} VND`;
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function GuestCostPerformanceDashboard({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const data = initialData;

  const filters: GuestEfficiencyFilters = {
    period: searchParams.get("period") ?? data.filters.periods[0] ?? "",
    hotel: searchParams.get("hotel") ?? "All Hotels",
    warehouse: searchParams.get("warehouse") ?? "All Warehouses",
    guestMethod: searchParams.get("guestMethod") ?? "total_guests",
  };

  const kpis = useMemo(
    () => [
      {
        label: "Current Cost per Guest",
        value: formatVnd(data.kpis.currentCostPerGuest),
        tone: styles.neutral,
      },
      {
        label: "Month-over-Month Change",
        value: formatPercent(data.kpis.momChange),
        tone: data.kpis.momChange <= 0 ? styles.success : styles.danger,
      },
      {
        label: "Year-over-Year Change",
        value: formatPercent(data.kpis.yoyChange),
        tone: data.kpis.yoyChange <= 0 ? styles.success : styles.danger,
      },
      {
        label: "Current Cost per Room Night",
        value: formatVnd(data.kpis.currentCostPerRoomNight),
        tone: styles.neutral,
      },
    ],
    [data]
  );

  function updateFilter(field: keyof GuestEfficiencyFilters, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set(field, value);

    router.push(`/dashboard/guest-efficiency?${params.toString()}`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div>
          <h1 className={styles.title}>Guest Cost Performance</h1>
          <p className={styles.subtitle}>
            Cost efficiency metrics per guest and room night
          </p>
        </div>

        <div className={styles.filters}>
          <select
            className={styles.select}
            value={filters.period}
            onChange={(event) => updateFilter("period", event.target.value)}
          >
            {data.filters.periods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={filters.hotel}
            onChange={(event) => updateFilter("hotel", event.target.value)}
          >
            <option value="All Hotels">All Hotels</option>
            {data.filters.hotels.map((hotel) => (
              <option key={hotel.value} value={hotel.value}>
                {hotel.label}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={filters.warehouse}
            onChange={(event) => updateFilter("warehouse", event.target.value)}
          >
            <option value="All Warehouses">All Warehouses</option>
            {data.filters.warehouses.map((warehouse) => (
              <option key={warehouse.value} value={warehouse.value}>
                {warehouse.label}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={filters.guestMethod}
            onChange={(event) => updateFilter("guestMethod", event.target.value)}
          >
            {data.filters.guestMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className={styles.kpiGrid}>
        {kpis.map((item) => (
          <div className={styles.card} key={item.label}>
            <div className={styles.kpiLabel}>{item.label}</div>
            <div className={`${styles.kpiValue} ${item.tone}`}>
              {item.value}
            </div>
          </div>
        ))}
      </section>

      <section className={styles.card}>
        <div className={styles.sectionTitle}>Performance Highlights</div>

        <div className={styles.insightGrid}>
          {data.insights.map((insight) => (
            <div className={styles.insightItem} key={insight}>
              {insight}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.chartGrid}>
        <GuestCostTrendChart
          title="Cost per Guest Trend"
          data={data.charts.costPerGuestTrend}
        />

        <GuestCostTrendChart
          title="Cost per Room Night Trend"
          data={data.charts.costPerRoomNightTrend}
        />
      </section>

      <section className={styles.card}>
        <div className={styles.sectionTitle}>Monthly Performance Summary</div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Period</th>
                <th>Total Cost</th>
                <th>Guest Count</th>
                <th>Cost per Guest</th>
                <th>Cost per Room Night</th>
                <th>MoM Change</th>
                <th>YoY Change</th>
              </tr>
            </thead>

            <tbody>
              {data.tableRows.map((row) => (
                <tr key={row.period}>
                  <td>{row.period}</td>
                  <td>{formatVnd(row.totalCost)}</td>
                  <td>{row.guestCount.toLocaleString("en-US")}</td>
                  <td>{formatVnd(row.costPerGuest)}</td>
                  <td>{formatVnd(row.costPerRoomNight)}</td>
                  <td className={row.momChange <= 0 ? styles.success : styles.danger}>
                    {formatPercent(row.momChange)}
                  </td>
                  <td className={row.yoyChange <= 0 ? styles.success : styles.danger}>
                    {formatPercent(row.yoyChange)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}