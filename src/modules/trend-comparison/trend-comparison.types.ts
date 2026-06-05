export interface TrendComparisonRow {
  used_month: string;
  hotel_code: string;
  hotel_name: string;
  series_code: string;
  series_name: string;
  warehouse_cost: number;
  revenue: number;
  room_nights: number;
  adr: number;
  cost_revenue_percent: number;
  cost_per_room_night: number;
  revenue_per_room_night: number;
}

export interface TrendComparisonFilters {
  hotelCode?: string;
  warehouseCodes?: string[];
  monthTo?: string;
  showTotal?: boolean;
}

export interface TrendComparisonHotelOption {
  hotel_code: string;
  hotel_name: string;
}

export interface TrendComparisonWarehouseOption {
  warehouse_code: string;
  hotel_code: string;
}