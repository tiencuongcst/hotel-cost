export type SelectOption = {
  value: string;
  label: string;
};

export type GuestEfficiencyFilterOptions = {
  periods: string[];
  hotels: SelectOption[];
  warehouses: SelectOption[];
  guestMethods: SelectOption[];
};

export type GuestEfficiencyFilters = {
  period: string;
  hotel: string;
  warehouse: string;
  guestMethod: string;
};

export type GuestEfficiencyKpis = {
  currentCostPerGuest: number;
  momChange: number;
  yoyChange: number;
  currentCostPerRoomNight: number;
};

export type GuestEfficiencyChartPoint = {
  period: string;
  value: number;
};

export type GuestEfficiencyTableRow = {
  period: string;
  totalCost: number;
  guestCount: number;
  costPerGuest: number;
  costPerRoomNight: number;
  momChange: number;
  yoyChange: number;
};

export type GuestEfficiencyDashboardData = {
  filters: GuestEfficiencyFilterOptions;
  kpis: GuestEfficiencyKpis;
  insights: string[];
  charts: {
    costPerGuestTrend: GuestEfficiencyChartPoint[];
    costPerRoomNightTrend: GuestEfficiencyChartPoint[];
  };
  tableRows: GuestEfficiencyTableRow[];
};