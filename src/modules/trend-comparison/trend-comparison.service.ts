import { supabase } from '@/lib/supabase/client';

import {
  TrendComparisonFilters,
  TrendComparisonHotelOption,
  TrendComparisonRow,
  TrendComparisonWarehouseOption,
} from './trend-comparison.types';

export async function getTrendComparison(
  filters: TrendComparisonFilters
): Promise<TrendComparisonRow[]> {
  const { data, error } = await supabase.rpc(
    'rpc_get_12m_trend_comparison',
    {
      p_hotel_code: filters.hotelCode ?? null,
      p_warehouse_codes: filters.warehouseCodes?.length
        ? filters.warehouseCodes
        : null,
      p_month_to: filters.monthTo ?? null,
      p_show_total: filters.showTotal ?? true,
    }
  );

  if (error) {
    throw error;
  }

  return (data ?? []) as TrendComparisonRow[];
}

export async function getTrendComparisonHotels(): Promise<
  TrendComparisonHotelOption[]
> {
  const { data, error } = await supabase
    .from('data_hotelinfo')
    .select('hotel_code, hotel_name')
    .order('hotel_code', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as TrendComparisonHotelOption[];
}

export async function getTrendComparisonWarehouses(
  hotelCode?: string
): Promise<TrendComparisonWarehouseOption[]> {
  let query = supabase
    .from('data_warehouse')
    .select('warehouse_code, hotel_code')
    .eq('active', true)
    .order('warehouse_code', { ascending: true });

  if (hotelCode) {
    query = query.eq('hotel_code', hotelCode);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as TrendComparisonWarehouseOption[];
}