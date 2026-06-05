export type AlertHotelOption = {
  hotelCode: string;
  hotelName: string;
};

export type AlertWarehouseOption = {
  warehouseCode: string;
  warehouseName: string;
};

export type AlertFilterOptions = {
  months: string[];
  hotels: AlertHotelOption[];
  warehouses: AlertWarehouseOption[];
};

export type AlertKpis = {
  criticalAlerts: number;
  highRiskItems: number;
  potentialCostImpact: number;
  newAlerts: number;
  avgCostChange: number;
};

export type TopAlert = {
  rank: number;
  usedMonth: string;
  hotelCode: string;
  hotelName: string;
  warehouseCode: string;
  itemCode: string;
  itemName: string;
  unit: string;
  mainAlertType: string;
  severity: string;
  impactAmount: number;

  priceAlertType: string | null;
  priceChangePercent: number | null;

  quantityAlertType: string | null;
  quantityChangePercent: number | null;

  costAlertType: string | null;
  costChangePercent: number | null;
};

export type AlertByType = {
  type: string;
  count: number;
  percent: number;
};

export type AlertRow = {
  usedMonth: string;
  previousUsedMonth: string | null;

  hotelCode: string;
  hotelName: string;
  warehouseCode: string;

  itemCode: string;
  itemName: string;
  unit: string;

  mainAlertType: string;
  severity: string;
  status: string;

  currentPrice: number;
  previousPrice: number;
  priceAlertType: string | null;
  priceChangePercent: number;
  priceChangeAmount: number;
  priceImpactAmount: number;

  currentQuantity: number;
  previousQuantity: number;
  quantityAlertType: string | null;
  quantityChangePercent: number;
  quantityChangeAmount: number;
  quantityImpactAmount: number;

  currentCost: number;
  previousCost: number;
  costAlertType: string | null;
  costChangePercent: number;
  costChangeAmount: number;
  costImpactAmount: number;

  impactAmount: number;
};

export type AlertsDashboardData = {
  kpis: AlertKpis;
  summary: string[];
  topAlerts: TopAlert[];
  alertsByType: AlertByType[];
  alerts: AlertRow[];
  filterOptions: AlertFilterOptions;
};

export type AlertSearchParams = {
  usedMonth?: string;
  hotelCode?: string;
  warehouseCode?: string;
  guestMethod?: string;
};