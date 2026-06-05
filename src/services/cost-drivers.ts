import { createClient } from "@/lib/supabase/server";
import type {
  CostDriversParams,
  CostDriversRpcResponse,
} from "@/types/cost-drivers";

export async function getCostDriversDashboard(
  params: CostDriversParams
): Promise<CostDriversRpcResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("rpc_get_cost_driver", {
    p_used_month: params.usedMonth,
    p_hotel_code: params.hotelCode ?? null,
    p_warehouse_code: params.warehouseCode ?? null,
    p_guest_method: params.guestMethod ?? "total_guests",
  });

  if (error) {
    throw new Error(`Failed to load cost drivers: ${error.message}`);
  }

  return data as CostDriversRpcResponse;
}
export type CostDriverFilterOptions = {
  months: { value: string; label: string }[];
  hotels: { value: string; label: string }[];
  warehouses: { value: string; label: string }[];
  guestMethods: { value: string; label: string }[];
};

export async function getCostDriverFilterOptions(): Promise<CostDriverFilterOptions> {
  const supabase = await createClient();

  const [monthsResult, hotelsResult, warehousesResult] = await Promise.all([
    supabase
      .from("mv_cost_driver")
      .select("used_month")
      .order("used_month", { ascending: false })
      .limit(100),

    supabase
      .from("mv_cost_driver")
      .select("hotel_code")
      .order("hotel_code", { ascending: true })
      .limit(1000),

    supabase
      .from("mv_cost_driver")
      .select("warehouse_code")
      .order("warehouse_code", { ascending: true })
      .limit(1000),
  ]);

  if (monthsResult.error) {
    throw new Error(monthsResult.error.message);
  }

  if (hotelsResult.error) {
    throw new Error(hotelsResult.error.message);
  }

  if (warehousesResult.error) {
    throw new Error(warehousesResult.error.message);
  }

  const months = Array.from(
    new Set(
      monthsResult.data
        .map((row) => row.used_month)
        .filter(Boolean)
    )
  ).map((month) => ({
    value: String(month),
    label: String(month).slice(0, 7),
  }));

  const hotels = Array.from(
    new Set(
      hotelsResult.data
        .map((row) => row.hotel_code)
        .filter(Boolean)
    )
  ).map((hotelCode) => ({
    value: String(hotelCode),
    label: String(hotelCode),
  }));

  const warehouses = Array.from(
    new Set(
      warehousesResult.data
        .map((row) => row.warehouse_code)
        .filter(Boolean)
    )
  ).map((warehouseCode) => ({
    value: String(warehouseCode),
    label: String(warehouseCode),
  }));

  return {
    months,
    hotels,
    warehouses,
    guestMethods: [
      { value: "total_guests", label: "Total Guests" },
      { value: "room_nights", label: "Room Nights" },
    ],
  };
}