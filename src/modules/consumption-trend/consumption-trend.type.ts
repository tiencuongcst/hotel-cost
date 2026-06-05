// src/modules/consumption-trend/consumption-trend.type.ts

import type {
  CostTrendFilters,
  CostTrendItemRow,
  WarehouseTrendRow,
} from "@/modules/cost-trend/cost-trend.type";

export type ConsumptionTrendFilters = CostTrendFilters;

export type ConsumptionTrendKpis = {
  current_cost: number;
  mom_change_percent: number;
  yoy_change_percent: number;
  current_cost_per_guest: number;
};

export type ConsumptionInsightSummary = {
  executive_summary: string[];
  recommended_actions: string[];
};

export type ItemTrendInsight = {
  highest_cost_item: string;
  largest_increase_item: string;
  largest_decrease_item: string;
  most_stable_item: string;
  selected_item_count: number;
};

export type WarehouseTrendInsight = {
  highest_cost_warehouse: string;
  lowest_cost_warehouse: string;
  top_growth_warehouse: string;
  top_reduction_warehouse: string;
  cost_concentration_percent: number;
};

export type ConsumptionDetailRow = {
  item_code: string;
  item_name: string;
  warehouse_code: string;
  current_cost: number;
  mom_change_percent: number;
  yoy_change_percent: number;
  status: "Normal" | "Review" | "Critical";
};

export type ConsumptionTrendResponse = {
  filters: ConsumptionTrendFilters;
  kpis: ConsumptionTrendKpis;
  insight_summary: ConsumptionInsightSummary;
  item_insight: ItemTrendInsight;
  warehouse_insight: WarehouseTrendInsight;
  item_trend: CostTrendItemRow[];
  warehouse_trend: WarehouseTrendRow[];
  details: ConsumptionDetailRow[];
};