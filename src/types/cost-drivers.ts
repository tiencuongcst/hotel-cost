export type CostDriverItem = {
  item_code: string;
  item_name: string;
  unit: string;
  current_cost: number;
  previous_cost?: number;
  impact_amount?: number;
  change_percent?: number;
  contribution_percent?: number;
};

export type CostDriversRpcResponse = {
  top_cost_increase: CostDriverItem[];
  top_cost_decrease: CostDriverItem[];
  top_contributors: CostDriverItem[];
};

export type CostDriversParams = {
  usedMonth: string;
  hotelCode?: string;
  warehouseCode?: string;
  guestMethod?: string;
};