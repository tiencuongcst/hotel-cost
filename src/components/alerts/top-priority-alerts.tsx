import type { TopAlert } from "@/types/alerts";

type Props = {
  data: TopAlert[];
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

function getMainPercent(item: TopAlert) {
  if (item.mainAlertType.startsWith("UNIT_PRICE")) {
    return item.priceChangePercent;
  }

  if (item.mainAlertType.startsWith("QUANTITY")) {
    return item.quantityChangePercent;
  }

  if (item.mainAlertType.startsWith("TOTAL_COST")) {
    return item.costChangePercent;
  }

  return null;
}

export function TopPriorityAlerts({ data }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-950">
        Top Priority Alerts
      </h2>

      <div className="space-y-4">
        {data.map((item) => {
          const mainPercent = getMainPercent(item);

          return (
            <div
              key={`${item.rank}-${item.itemCode}-${item.warehouseCode}-${item.usedMonth}`}
              className="flex items-start justify-between border-b border-slate-100 pb-3 last:border-b-0"
            >
              <div>
                <div className="font-medium text-slate-900">
                  {item.rank}. {item.itemName}
                </div>
                <div className="text-xs text-slate-500">
                  {item.warehouseCode} · {item.unit}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {item.mainAlertType}
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-red-500">
                  {formatPercent(mainPercent)}
                </div>
                <div className="text-xs text-slate-500">
                  {formatVnd(item.impactAmount)} VND
                </div>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <p className="text-sm text-slate-500">No priority alerts.</p>
        )}
      </div>
    </div>
  );
}