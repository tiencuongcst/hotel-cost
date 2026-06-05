export type CostTrendFilters = {
  used_month?: string;
  hotel_code?: string;
  warehouse_code?: string;
  guest_method?: string;
  item_codes?: string[];
};

export type CostTrendKpis = {
  current_total_cost: number;
  last_month_total_cost: number;
  last_year_total_cost: number;
  mom_change_amount: number;
  mom_change_percent: number;
  yoy_change_amount: number;
  yoy_change_percent: number;

  current_cost_per_guest: number;
  last_month_cost_per_guest: number;
  last_year_cost_per_guest: number;
  cost_per_guest_mom_change_amount: number;
  cost_per_guest_mom_change_percent: number;
  cost_per_guest_yoy_change_amount: number;
  cost_per_guest_yoy_change_percent: number;
};

export type CostTrendRow = {
  used_month: string;
  total_cost: number;
  total_quantity: number;
  number_of_items: number;
  selected_guest_base: number;
  cost_per_guest: number;
};

export type WarehouseTrendRow = {
  used_month: string;
  warehouse_code: string;
  total_cost: number;
  total_quantity: number;
  number_of_items: number;
};

export type CostTrendItemOption = {
  item_code: string;
  item_name: string | null;
  unit: string | null;
  total_quantity: number;
  avg_unit_price: number;
  total_cost: number;
};

export type CostTrendItemRow = {
  used_month: string;
  item_code: string;
  item_name: string | null;
  unit: string | null;
  total_quantity: number;
  total_cost: number;
};

export type CostTrendResponse = {
  filters: {
    used_month: string;
    hotel_code: string | null;
    warehouse_code: string | null;
    guest_method: string;
    item_codes: string[] | null;
  };
  kpis: CostTrendKpis;
  monthly_trend: CostTrendRow[];
  warehouse_trend: WarehouseTrendRow[];
  item_options: CostTrendItemOption[];
  item_trend: CostTrendItemRow[];
};