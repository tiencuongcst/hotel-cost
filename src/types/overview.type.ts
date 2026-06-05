export type GuestMethod = "total_guests" | "equivalent_guests";

export type OverviewFilter = {
  used_month?: string;
  hotel_code?: string;
  warehouse_code?: string;
  guest_method?: GuestMethod;
};

export type OverviewKpis = {
  cost_ratio: number;
  total_cost: number;
  guest_method: GuestMethod;
  cost_per_guest: number;
  total_quantity: number;
  number_of_items: number;
  cost_per_room_night: number;
  selected_guest_base: number;
  cost_per_equivalent_guest: number;
};

export type OverviewTopItem = {
  item_code: string;
  item_name: string | null;
  unit: string | null;
  warehouse_code: string | null;
  warehouse_name: string | null;
  total_cost: number;
  total_quantity: number;
  avg_unit_price: number;
  cost_ratio: number;
};

export type OverviewWarehouseCost = {
  warehouse_code: string;
  warehouse_name: string | null;
  total_cost: number;
  cost_ratio: number;
};

export type OverviewData = {
  kpis: OverviewKpis;
  top_items: OverviewTopItem[];
  cost_by_warehouse: OverviewWarehouseCost[];
};
