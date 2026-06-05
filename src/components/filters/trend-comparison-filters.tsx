'use client';

import {
  TrendComparisonHotelOption,
  TrendComparisonWarehouseOption,
} from '@/modules/trend-comparison/trend-comparison.types';

interface Props {
  hotelCode: string;
  warehouseCodes: string[];
  showTotal: boolean;
  monthTo: string;
  hotels: TrendComparisonHotelOption[];
  warehouses: TrendComparisonWarehouseOption[];
  onHotelChange: (value: string) => void;
  onWarehouseToggle: (value: string) => void;
  onShowTotalChange: (value: boolean) => void;
  onMonthToChange: (value: string) => void;
}

export default function TrendComparisonFilters({
  hotelCode,
  warehouseCodes,
  showTotal,
  monthTo,
  hotels,
  warehouses,
  onHotelChange,
  onWarehouseToggle,
  onShowTotalChange,
  onMonthToChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <select
          value={hotelCode}
          onChange={(event) => onHotelChange(event.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">All Hotels</option>

          {hotels.map((hotel) => (
            <option key={hotel.hotel_code} value={hotel.hotel_code}>
              {hotel.hotel_name}
            </option>
          ))}
        </select>

        <select
          value={showTotal ? 'total' : 'selected'}
          onChange={(event) =>
            onShowTotalChange(event.target.value === 'total')
          }
          className="rounded border px-3 py-2"
        >
          <option value="total">Total Warehouses</option>
          <option value="selected">Selected Warehouses</option>
        </select>

        <select className="rounded border px-3 py-2" disabled>
          <option>Revenue vs ADR vs Cost</option>
        </select>

        <select
          value={monthTo}
          onChange={(event) => onMonthToChange(event.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="2026-05-01">Last 12 Months to 2026-05</option>
          <option value="2026-04-01">Last 12 Months to 2026-04</option>
          <option value="2026-03-01">Last 12 Months to 2026-03</option>
          <option value="2026-02-01">Last 12 Months to 2026-02</option>
        </select>
      </div>

      {!showTotal && (
        <div className="rounded border bg-white p-4">
          <div className="mb-3 font-semibold">
            Chọn kho để so sánh
          </div>

          <div className="grid grid-cols-4 gap-3">
            {warehouses.map((warehouse) => (
              <label
                key={`${warehouse.hotel_code}-${warehouse.warehouse_code}`}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={warehouseCodes.includes(warehouse.warehouse_code)}
                  onChange={() =>
                    onWarehouseToggle(warehouse.warehouse_code)
                  }
                />

                <span>
                  {warehouse.warehouse_code}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}