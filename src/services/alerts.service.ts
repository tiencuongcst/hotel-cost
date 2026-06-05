import { createClient } from "@/lib/supabase/server";
import type { AlertsDashboardData, AlertSearchParams } from "@/types/alerts";

export async function getAlertsDashboard(
  params: AlertSearchParams
): Promise<AlertsDashboardData> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("rpc_get_alerts_dashboard", {
    p_used_month: params.usedMonth || null,
    p_hotel_code: params.hotelCode || null,
    p_warehouse_code: params.warehouseCode || null,
    p_guest_method: params.guestMethod || "total",
  });

  if (error) {
    console.error("rpc_get_alerts_dashboard error:", error);
    throw new Error(error.message);
  }

  return data as AlertsDashboardData;
}