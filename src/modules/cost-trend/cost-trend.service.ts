import { supabase } from "@/lib/supabase/client";
import type {
  CostTrendFilters,
  CostTrendResponse,
} from "./cost-trend.type";

export async function getCostTrend(
  filters: CostTrendFilters
): Promise<CostTrendResponse> {
  const { data, error } = await supabase.rpc("rpc_get_cost_trend", {
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
    console.error("rpc_get_cost_trend error:", error);
    throw new Error(error.message);
  }

  return data as CostTrendResponse;
}