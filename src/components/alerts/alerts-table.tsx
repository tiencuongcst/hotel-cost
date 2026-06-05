import type { AlertRow } from "@/types/alerts";

type Props = {
  title: string;
  description: string;
  data: AlertRow[];
  tone: "increase" | "decrease";
};

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  const sign = value > 0 ? "+" : "";

  return `${sign}${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

function severityClass(severity: string) {
  switch (severity) {
    case "Critical":
      return "bg-red-100 text-red-700";
    case "High":
      return "bg-orange-100 text-orange-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function valueClass(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "text-slate-400";
  }

  if (value > 0) {
    return "font-semibold text-red-600";
  }

  if (value < 0) {
    return "font-semibold text-blue-600";
  }

  return "text-slate-400";
}

function MetricChange({
  label,
  value,
  color,
  active,
}: {
  label: string;
  value: number | null | undefined;
  color: "red" | "blue" | "orange";
  active: boolean;
}) {
  const colorClass = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          active ? colorClass[color] : "bg-slate-200"
        }`}
      />
      <span className="w-10 text-slate-600">{label}</span>
      <span className={active ? valueClass(value) : "text-slate-400"}>
        {active ? formatPercent(value) : "-"}
      </span>
    </div>
  );
}

export function AlertsTable({ title, description, data, tone }: Props) {
  const titleColor = tone === "increase" ? "text-red-600" : "text-blue-600";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className={`text-lg font-semibold ${titleColor}`}>{title}</h2>
        <p className="text-sm text-slate-500">
          {description} Hiển thị {data.length} alert.
        </p>
      </div>

      <div className="max-h-[520px] overflow-auto rounded-lg border border-slate-100">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500 shadow-sm">
            <tr>
              <th className="px-3 py-3">Severity</th>
              <th className="px-3 py-3">Item</th>
              <th className="px-3 py-3">Warehouse</th>
              <th className="px-3 py-3">Changes</th>
              <th className="px-3 py-3 text-right">Current Cost</th>
              <th className="px-3 py-3 text-right">Previous Cost</th>
              <th className="px-3 py-3 text-right">Impact</th>
              <th className="px-3 py-3">Main Alert</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={`${row.usedMonth}-${row.hotelCode}-${row.warehouseCode}-${row.itemCode}-${row.mainAlertType}`}
                className="border-b border-slate-100"
              >
                <td className="px-3 py-4 align-top">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${severityClass(
                      row.severity
                    )}`}
                  >
                    {row.severity}
                  </span>
                </td>

                <td className="px-3 py-4 align-top">
                  <div className="font-medium text-slate-900">
                    {row.itemName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {row.itemCode} · {row.unit}
                  </div>
                </td>

                <td className="px-3 py-4 align-top">{row.warehouseCode}</td>

                <td className="px-3 py-4 align-top">
                  <div className="space-y-1">
                    <MetricChange
                      label="Price"
                      value={row.priceChangePercent}
                      color="red"
                      active={Boolean(row.priceAlertType)}
                    />
                    <MetricChange
                      label="Qty"
                      value={row.quantityChangePercent}
                      color="blue"
                      active={Boolean(row.quantityAlertType)}
                    />
                    <MetricChange
                      label="Cost"
                      value={row.costChangePercent}
                      color="orange"
                      active={Boolean(row.costAlertType)}
                    />
                  </div>
                </td>

                <td className="px-3 py-4 text-right align-top">
                  {formatVnd(row.currentCost)}
                </td>

                <td className="px-3 py-4 text-right align-top">
                  {formatVnd(row.previousCost)}
                </td>

                <td className="px-3 py-4 text-right align-top font-semibold">
                  {formatVnd(row.impactAmount)}
                </td>

                <td className="px-3 py-4 align-top text-xs text-slate-600">
                  {row.mainAlertType}
                </td>

                <td className="px-3 py-4 align-top">{row.status}</td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-10 text-center text-sm text-slate-500"
                >
                  Không có alert phù hợp với filter hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}