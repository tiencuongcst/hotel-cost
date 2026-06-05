import { supabase } from "@/lib/supabase/client";
import type {
  OverviewData,
  OverviewFilter,
} from "@/types/overview.type";
import type { OverviewFilterOptions } from "@/components/filters/overview-filters";

const emptyOverview: OverviewData = {
  kpis: {
    cost_ratio: 0,
    total_cost: 0,
    guest_method: "total_guests",
    cost_per_guest: 0,
    total_quantity: 0,
    number_of_items: 0,
    cost_per_room_night: 0,
    selected_guest_base: 0,
    cost_per_equivalent_guest: 0,
  },
  top_items: [],
  cost_by_warehouse: [],
};

export async function getOverview(filters: OverviewFilter): Promise<OverviewData> {
  const { data, error } = await supabase.rpc("rpc_get_overview", {
    p_used_month: filters.used_month ?? null,
    p_hotel_code: filters.hotel_code ?? null,
    p_warehouse_code: filters.warehouse_code ?? null,
    p_guest_method: filters.guest_method ?? "total_guests",
  });

  if (error) {
    console.error("rpc_get_overview error:", error);
    throw new Error(error.message);
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return emptyOverview;
  }

  return data as OverviewData;
}

export async function getOverviewFilterOptions(): Promise<OverviewFilterOptions> {
  const { data, error } = await supabase
    .from("mv_cost_trend")
    .select("used_month, hotel_code, hotel_name, warehouse_code")
    .order("used_month", { ascending: false })
    .limit(10000);

  if (error) {
    console.error("filter options error:", error);
    throw new Error(error.message);
  }

  const rows = data ?? [];

  const months = Array.from(
    new Set(
      rows
        .map((row) => String(row.used_month))
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a));

  const hotels = Array.from(
    new Map(
      rows
        .filter((row) => row.hotel_code)
        .map((row) => [
          String(row.hotel_code),
          {
            hotel_code: String(row.hotel_code),
            hotel_name: row.hotel_name ? String(row.hotel_name) : null,
          },
        ])
    ).values()
  ).sort((a, b) =>
    (a.hotel_name ?? a.hotel_code).localeCompare(b.hotel_name ?? b.hotel_code)
  );

  const warehouses = Array.from(
    new Map(
      rows
        .filter((row) => row.warehouse_code)
        .map((row) => [
          String(row.warehouse_code),
          {
            warehouse_code: String(row.warehouse_code),
            warehouse_name: String(row.warehouse_code),
          },
        ])
    ).values()
  ).sort((a, b) =>
    (a.warehouse_name ?? a.warehouse_code).localeCompare(
      b.warehouse_name ?? b.warehouse_code
    )
  );

  return {
    months,
    hotels,
    warehouses,
  };
}
