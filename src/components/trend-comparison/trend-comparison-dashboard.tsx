'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  getTrendComparison,
  getTrendComparisonHotels,
  getTrendComparisonWarehouses,
} from '@/modules/trend-comparison/trend-comparison.service';

import {
  TrendComparisonHotelOption,
  TrendComparisonRow,
  TrendComparisonWarehouseOption,
} from '@/modules/trend-comparison/trend-comparison.types';

import TrendComparisonFilters from '@/components/filters/trend-comparison-filters';
import TrendComparisonLineChart from '@/components/charts/trend-comparison-line-chart';

export default function TrendComparisonDashboard() {
  const [loading, setLoading] = useState(false);

  const [hotelCode, setHotelCode] = useState('');
  const [warehouseCodes, setWarehouseCodes] = useState<string[]>([]);
  const [showTotal, setShowTotal] = useState(true);
  const [monthTo, setMonthTo] = useState('2026-05-01');

  const [data, setData] = useState<TrendComparisonRow[]>([]);
  const [hotels, setHotels] = useState<TrendComparisonHotelOption[]>([]);
  const [warehouses, setWarehouses] = useState<TrendComparisonWarehouseOption[]>([]);

  async function loadOptions() {
    const [hotelResult, warehouseResult] = await Promise.all([
      getTrendComparisonHotels(),
      getTrendComparisonWarehouses(hotelCode || undefined),
    ]);

    setHotels(hotelResult);
    setWarehouses(warehouseResult);
  }

  async function loadData() {
    try {
      setLoading(true);

      const result = await getTrendComparison({
        hotelCode: hotelCode || undefined,
        warehouseCodes: showTotal ? [] : warehouseCodes,
        monthTo,
        showTotal,
      });

      setData(result);
    } catch (error) {
      console.error('Trend comparison error:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOptions();
  }, [hotelCode]);

  useEffect(() => {
    loadData();
  }, [hotelCode, warehouseCodes, showTotal, monthTo]);

  const chartData = useMemo(() => {
    const map = new Map<string, TrendComparisonRow>();

    data.forEach((row) => {
      const current = map.get(row.used_month);

      if (!current) {
        map.set(row.used_month, { ...row });
        return;
      }

      const revenue = current.revenue + row.revenue;
      const roomNights = current.room_nights + row.room_nights;
      const warehouseCost = current.warehouse_cost + row.warehouse_cost;

      map.set(row.used_month, {
        ...current,
        revenue,
        room_nights: roomNights,
        warehouse_cost: warehouseCost,
        adr: roomNights > 0 ? Math.round(revenue / roomNights) : 0,
        cost_revenue_percent:
          revenue > 0 ? Number(((warehouseCost / revenue) * 100).toFixed(2)) : 0,
        cost_per_room_night:
          roomNights > 0 ? Math.round(warehouseCost / roomNights) : 0,
        revenue_per_room_night:
          roomNights > 0 ? Math.round(revenue / roomNights) : 0,
      });
    });

    return Array.from(map.values()).sort((a, b) =>
      a.used_month.localeCompare(b.used_month)
    );
  }, [data]);

  function handleHotelChange(value: string) {
    setHotelCode(value);
    setWarehouseCodes([]);
    setShowTotal(true);
  }

  function handleWarehouseModeChange(value: boolean) {
    setShowTotal(value);
    setWarehouseCodes([]);
  }

  function handleWarehouseToggle(value: string) {
    setWarehouseCodes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  return (
    <div className="space-y-5">
      <TrendComparisonFilters
        hotelCode={hotelCode}
        warehouseCodes={warehouseCodes}
        showTotal={showTotal}
        monthTo={monthTo}
        hotels={hotels}
        warehouses={warehouses}
        onHotelChange={handleHotelChange}
        onWarehouseToggle={handleWarehouseToggle}
        onShowTotalChange={handleWarehouseModeChange}
        onMonthToChange={setMonthTo}
      />

      <div className="text-sm text-slate-500">
        Filter đang áp dụng: Hotel = {hotelCode || 'All Hotels'} | Warehouse ={' '}
        {showTotal ? 'Total Warehouses' : warehouseCodes.join(', ') || 'Chưa chọn kho'} | Month To = {monthTo}
      </div>

      {loading && <div>Loading...</div>}

      {!loading && <TrendComparisonLineChart data={chartData} />}
    </div>
  );
}