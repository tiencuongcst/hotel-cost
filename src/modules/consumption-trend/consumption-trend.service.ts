// src/modules/consumption-trend/consumption-trend.service.ts

import { supabase } from "@/lib/supabase/client";
import type {
  CostTrendItemRow,
  WarehouseTrendRow,
} from "@/modules/cost-trend/cost-trend.type";
import type {
  ConsumptionDetailRow,
  ConsumptionTrendFilters,
  ConsumptionTrendResponse,
  ItemTrendInsight,
  WarehouseTrendInsight,
} from "./consumption-trend.type";

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0.00%";
  return `${value.toFixed(2)}%`;
}

function getLatestMonth<T extends { used_month: string }>(
  rows: T[]
): string | null {
  if (rows.length === 0) return null;

  return [...rows]
    .map((row) => row.used_month)
    .sort((a, b) => b.localeCompare(a))[0];
}

function getPreviousMonth(currentMonth: string): string {
  const [year, month] = currentMonth.split("-").map(Number);
  const date = new Date(year, month - 2, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-01`;
}

function getChangePercent(current: number, previous: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
    return 0;
  }

  return ((current - previous) / previous) * 100;
}

function sumCost(rows: Array<{ total_cost: number }>): number {
  return rows.reduce((sum, row) => sum + Number(row.total_cost || 0), 0);
}

function buildItemInsight(itemTrend: CostTrendItemRow[]): ItemTrendInsight {
  const currentMonth = getLatestMonth(itemTrend);

  if (!currentMonth) {
    return {
      highest_cost_item: "—",
      largest_increase_item: "—",
      largest_decrease_item: "—",
      most_stable_item: "—",
      selected_item_count: 0,
    };
  }

  const previousMonth = getPreviousMonth(currentMonth);

  const currentRows = itemTrend.filter((row) => row.used_month === currentMonth);
  const previousRows = itemTrend.filter((row) => row.used_month === previousMonth);

  const previousCostMap = new Map(
    previousRows.map((row) => [row.item_code, Number(row.total_cost || 0)])
  );

  const rowsWithChange = currentRows.map((row) => {
    const currentCost = Number(row.total_cost || 0);
    const previousCost = previousCostMap.get(row.item_code) ?? 0;
    const changePercent = getChangePercent(currentCost, previousCost);

    return {
      item_name: row.item_name || row.item_code,
      current_cost: currentCost,
      change_percent: changePercent,
      abs_change_percent: Math.abs(changePercent),
    };
  });

  const highest = [...rowsWithChange].sort(
    (a, b) => b.current_cost - a.current_cost
  )[0];

  const increase = [...rowsWithChange].sort(
    (a, b) => b.change_percent - a.change_percent
  )[0];

  const decrease = [...rowsWithChange].sort(
    (a, b) => a.change_percent - b.change_percent
  )[0];

  const stable = [...rowsWithChange].sort(
    (a, b) => a.abs_change_percent - b.abs_change_percent
  )[0];

  return {
    highest_cost_item: highest?.item_name ?? "—",
    largest_increase_item: increase
      ? `${increase.item_name} (${formatPercent(increase.change_percent)})`
      : "—",
    largest_decrease_item: decrease
      ? `${decrease.item_name} (${formatPercent(decrease.change_percent)})`
      : "—",
    most_stable_item: stable?.item_name ?? "—",
    selected_item_count: new Set(currentRows.map((row) => row.item_code)).size,
  };
}

function buildWarehouseInsight(
  warehouseTrend: WarehouseTrendRow[]
): WarehouseTrendInsight {
  const currentMonth = getLatestMonth(warehouseTrend);

  if (!currentMonth) {
    return {
      highest_cost_warehouse: "—",
      lowest_cost_warehouse: "—",
      top_growth_warehouse: "—",
      top_reduction_warehouse: "—",
      cost_concentration_percent: 0,
    };
  }

  const previousMonth = getPreviousMonth(currentMonth);

  const currentRows = warehouseTrend.filter(
    (row) => row.used_month === currentMonth
  );
  const previousRows = warehouseTrend.filter(
    (row) => row.used_month === previousMonth
  );

  const previousCostMap = new Map(
    previousRows.map((row) => [row.warehouse_code, Number(row.total_cost || 0)])
  );

  const rowsWithChange = currentRows.map((row) => {
    const currentCost = Number(row.total_cost || 0);
    const previousCost = previousCostMap.get(row.warehouse_code) ?? 0;
    const changePercent = getChangePercent(currentCost, previousCost);

    return {
      warehouse_code: row.warehouse_code,
      current_cost: currentCost,
      change_percent: changePercent,
    };
  });

  const highest = [...rowsWithChange].sort(
    (a, b) => b.current_cost - a.current_cost
  )[0];

  const lowest = [...rowsWithChange].sort(
    (a, b) => a.current_cost - b.current_cost
  )[0];

  const growth = [...rowsWithChange].sort(
    (a, b) => b.change_percent - a.change_percent
  )[0];

  const reduction = [...rowsWithChange].sort(
    (a, b) => a.change_percent - b.change_percent
  )[0];

  const totalCost = sumCost(currentRows);
  const top3Cost = sumCost(
    [...currentRows].sort((a, b) => b.total_cost - a.total_cost).slice(0, 3)
  );

  return {
    highest_cost_warehouse: highest?.warehouse_code ?? "—",
    lowest_cost_warehouse: lowest?.warehouse_code ?? "—",
    top_growth_warehouse: growth
      ? `${growth.warehouse_code} (${formatPercent(growth.change_percent)})`
      : "—",
    top_reduction_warehouse: reduction
      ? `${reduction.warehouse_code} (${formatPercent(reduction.change_percent)})`
      : "—",
    cost_concentration_percent:
      totalCost > 0 ? Number(((top3Cost / totalCost) * 100).toFixed(2)) : 0,
  };
}

function buildDetails(itemTrend: CostTrendItemRow[]): ConsumptionDetailRow[] {
  const currentMonth = getLatestMonth(itemTrend);

  if (!currentMonth) return [];

  const previousMonth = getPreviousMonth(currentMonth);

  const currentRows = itemTrend.filter((row) => row.used_month === currentMonth);
  const previousRows = itemTrend.filter((row) => row.used_month === previousMonth);

  const previousCostMap = new Map(
    previousRows.map((row) => [row.item_code, Number(row.total_cost ?? 0)])
  );

  return currentRows
    .map((row): ConsumptionDetailRow => {
      const currentCost = Number(row.total_cost ?? 0);
      const previousCost = previousCostMap.get(row.item_code) ?? 0;
      const momChange = getChangePercent(currentCost, previousCost);

      let status: ConsumptionDetailRow["status"] = "Normal";

      if (momChange >= 25) {
        status = "Critical";
      } else if (momChange >= 10) {
        status = "Review";
      }

      return {
        item_code: row.item_code,
        item_name: row.item_name ?? row.item_code,
        warehouse_code: "ALL",
        current_cost: currentCost,
        mom_change_percent: momChange,
        yoy_change_percent: 0,
        status,
      };
    })
    .sort((a, b) => b.current_cost - a.current_cost)
    .slice(0, 100);
}

export async function getConsumptionTrend(
  filters: ConsumptionTrendFilters
): Promise<ConsumptionTrendResponse> {
  const { data, error } = await supabase.rpc("rpc_get_consumption_trend", {
    p_used_month: filters.used_month ?? null,
    p_hotel_code: filters.hotel_code ?? null,
    p_warehouse_code: filters.warehouse_code ?? null,
    p_guest_method: filters.guest_method ?? "total_guests",
    p_item_codes:
      filters.item_codes && filters.item_codes.length > 0
        ? filters.item_codes
        : null,
  });

  if (error) {
    console.error("rpc_get_consumption_trend error:", error);
    throw new Error(error.message);
  }

  const consumptionTrend = data as {
    filters: {
      used_month: string;
      hotel_code: string | null;
      warehouse_code: string | null;
      guest_method: string;
      item_codes: string[] | null;
    };
    kpis: {
      current_total_cost: number;
      mom_change_percent: number;
      yoy_change_percent: number;
      current_cost_per_guest: number;
    };
    item_trend: CostTrendItemRow[];
    warehouse_trend: WarehouseTrendRow[];
  };

  const itemInsight = buildItemInsight(consumptionTrend.item_trend);
  const warehouseInsight = buildWarehouseInsight(consumptionTrend.warehouse_trend);
  const details = buildDetails(consumptionTrend.item_trend);

  const currentCost = Number(consumptionTrend.kpis.current_total_cost || 0);
  const momPercent = Number(consumptionTrend.kpis.mom_change_percent || 0);
  const yoyPercent = Number(consumptionTrend.kpis.yoy_change_percent || 0);

  const alertCount = details.filter(
    (row) => row.status === "Review" || row.status === "Critical"
  ).length;

  return {
    filters,
    kpis: {
      current_cost: currentCost,
      mom_change_percent: momPercent,
      yoy_change_percent: yoyPercent,
      current_cost_per_guest: Number(
        consumptionTrend.kpis.current_cost_per_guest || 0
      ),
    },
    insight_summary: {
      executive_summary: [
        `Total consumption cost ${
          momPercent >= 0 ? "increased" : "decreased"
        } ${formatPercent(Math.abs(momPercent * 100))} MoM.`,
        `${warehouseInsight.highest_cost_warehouse} is the highest cost warehouse.`,
        `${itemInsight.highest_cost_item} is the highest cost item.`,
        `${alertCount} items require cost review.`,
      ],
      recommended_actions: [
        "Review items with MoM increase above 10%.",
        "Investigate warehouse with highest cost concentration.",
        "Validate abnormal consumption against purchasing and stock issue records.",
      ],
    },
    item_insight: itemInsight,
    warehouse_insight: warehouseInsight,
    item_trend: consumptionTrend.item_trend,
    warehouse_trend: consumptionTrend.warehouse_trend,
    details,
  };
}
type FilterOption = {
  label: string;
  value: string;
};

export async function getConsumptionTrendFilterOptions() {
  const pageSize = 1000;
  let from = 0;
  let allRows: {
    used_month: string | null;
    hotel_code: string | null;
    warehouse_code: string | null;
  }[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("mv_consumption_trend")
      .select("used_month, hotel_code, warehouse_code")
      .order("used_month", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("getConsumptionTrendFilterOptions error:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) break;

    allRows = [...allRows, ...data];

    if (data.length < pageSize) break;

    from += pageSize;
  }

  const { data: hotelRows, error: hotelError } = await supabase
    .from("data_hotelinfo")
    .select("hotel_code, hotel_name")
    .order("hotel_name", { ascending: true });

  if (hotelError) {
    console.error("get hotel_info error:", hotelError);
    throw new Error(hotelError.message);
  }

  const hotelNameMap = new Map(
    (hotelRows ?? []).map((hotel) => [
      hotel.hotel_code,
      hotel.hotel_name,
    ])
  );

  const months = Array.from(
    new Set(
      allRows
        .map((row) => row.used_month)
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => b.localeCompare(a));

  const hotels = Array.from(
    new Set(
      allRows
        .map((row) => row.hotel_code)
        .filter((value): value is string => Boolean(value))
    )
  )
    .sort()
    .map((hotelCode) => ({
      hotel_code: hotelCode,
      hotel_name: hotelNameMap.get(hotelCode) ?? hotelCode,
    }));

  const warehouses = Array.from(
    new Set(
      allRows
        .map((row) => row.warehouse_code)
        .filter((value): value is string => Boolean(value))
    )
  )
    .sort()
    .map((warehouseCode) => ({
      warehouse_code: warehouseCode,
      warehouse_name: warehouseCode,
    }));

  return {
    months,
    hotels,
    warehouses,
  };
}