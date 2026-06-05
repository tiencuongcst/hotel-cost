import type {
  AlertsDashboardData,
  AlertRow,
  AlertSearchParams,
} from "@/types/alerts";
import { AlertFilters } from "@/components/filters/alert-filters";
import { AlertSummary } from "@/components/alerts/alert-summary";
import { TopPriorityAlerts } from "@/components/alerts/top-priority-alerts";
import { AlertsByTypeChart } from "@/components/alerts/alerts-by-type-chart";
import { AlertsTable } from "@/components/alerts/alerts-table";

type Props = {
  data: AlertsDashboardData;
  selectedFilters: AlertSearchParams;
};

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function getMainChangePercent(row: AlertRow) {
  if (row.mainAlertType.startsWith("UNIT_PRICE")) {
    return row.priceChangePercent ?? 0;
  }

  if (row.mainAlertType.startsWith("QUANTITY")) {
    return row.quantityChangePercent ?? 0;
  }

  if (row.mainAlertType.startsWith("TOTAL_COST")) {
    return row.costChangePercent ?? 0;
  }

  return 0;
}

function isIncreaseAlert(row: AlertRow) {
  return row.mainAlertType.endsWith("INCREASE");
}

function isDecreaseAlert(row: AlertRow) {
  return row.mainAlertType.endsWith("DECREASE");
}

export function AlertsDashboard({ data, selectedFilters }: Props) {
  const increaseAlerts = data.alerts
  .filter(isIncreaseAlert)
  .sort((a, b) => getMainChangePercent(b) - getMainChangePercent(a))
  .slice(0, 500);

const decreaseAlerts = data.alerts
  .filter(isDecreaseAlert)
  .sort((a, b) => getMainChangePercent(a) - getMainChangePercent(b))
  .slice(0, 500);

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          Alerts & Exceptions
        </h1>
        <p className="text-sm text-slate-500">
          Monitor abnormal changes and high-risk items.
        </p>
      </div>

      <AlertFilters
        filterOptions={data.filterOptions}
        selectedFilters={selectedFilters}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard title="Critical Alerts" value={data.kpis.criticalAlerts} tone="red" />
        <KpiCard title="High Risk Items" value={data.kpis.highRiskItems} tone="orange" />
        <KpiCard
          title="Potential Cost Impact"
          value={`${formatVnd(data.kpis.potentialCostImpact)} VND`}
          tone="blue"
        />
        <KpiCard title="Total Alerts" value={data.kpis.newAlerts} tone="green" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AlertSummary summary={data.summary} />
        <TopPriorityAlerts data={data.topAlerts} />
        <AlertsByTypeChart data={data.alertsByType} />
      </section>

      <AlertsTable
        title="Alert tăng bất thường"
        description="Sắp xếp từ mức tăng lớn nhất đến nhẹ dần."
        data={increaseAlerts}
        tone="increase"
      />

      <AlertsTable
        title="Alert giảm bất thường"
        description="Sắp xếp từ mức giảm mạnh nhất đến nhẹ dần."
        data={decreaseAlerts}
        tone="decrease"
      />
    </main>
  );
}

function KpiCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string | number;
  tone: "red" | "orange" | "blue" | "green";
}) {
  const colorMap = {
    red: "text-red-600 bg-red-50",
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs ${colorMap[tone]}`}
      >
        {title}
      </div>
      <div className="text-2xl font-bold text-slate-950">{value}</div>
    </div>
  );
}