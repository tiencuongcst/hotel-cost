import { createClient } from "../../lib/supabase/server";

import {
  GuestEfficiencyDashboardData,
  GuestEfficiencyFilters,
} from "./guest-efficiency.type";

function toMonthDate(period?: string | null) {
  if (!period || period === "All Months") {
    return null;
  }

  return `${period}-01`;
}

export async function getGuestEfficiencyDashboardData(
  filters?: Partial<GuestEfficiencyFilters>
): Promise<GuestEfficiencyDashboardData> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "rpc_get_guest_efficiency_dashboard",
    {
      p_used_month: toMonthDate(filters?.period),
      p_hotel_code:
        !filters?.hotel || filters.hotel === "All Hotels" ? null : filters.hotel,
      p_warehouse_code:
        !filters?.warehouse || filters.warehouse === "All Warehouses"
          ? null
          : filters.warehouse,
      p_guest_method: filters?.guestMethod ?? "total_guests",
    }
  );

  if (error) {
    console.error("rpc_get_guest_efficiency_dashboard error:", error);
    throw new Error("Failed to load guest efficiency dashboard data.");
  }

  return data as GuestEfficiencyDashboardData;
}