"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ConsumptionTrendFilterOptions = {
  months: string[];
  hotels: {
    hotel_code: string;
    hotel_name: string | null;
  }[];
  warehouses: {
    warehouse_code: string;
    warehouse_name: string | null;
  }[];
};

type Props = {
  options: ConsumptionTrendFilterOptions;
};

export function ConsumptionTrendFilters({ options }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <section className="grid grid-cols-1 gap-3 rounded-md border border-slate-200 bg-white p-3 md:grid-cols-4">
      <select
        className="h-10 rounded-lg border bg-white px-3 text-sm"
        value={searchParams.get("used_month") ?? ""}
        onChange={(event) => updateFilter("used_month", event.target.value)}
      >
        <option value="">All Months</option>
        {options.months.map((month) => (
          <option key={month} value={month}>
            {month.slice(0, 7)}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-lg border bg-white px-3 text-sm"
        value={searchParams.get("hotel_code") ?? ""}
        onChange={(event) => updateFilter("hotel_code", event.target.value)}
      >
        <option value="">All Hotels</option>
        {options.hotels.map((hotel) => (
          <option key={hotel.hotel_code} value={hotel.hotel_code}>
            {hotel.hotel_name ?? hotel.hotel_code}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-lg border bg-white px-3 text-sm"
        value={searchParams.get("warehouse_code") ?? ""}
        onChange={(event) => updateFilter("warehouse_code", event.target.value)}
      >
        <option value="">All Warehouses</option>
        {options.warehouses.map((warehouse) => (
          <option
            key={warehouse.warehouse_code}
            value={warehouse.warehouse_code}
          >
            {warehouse.warehouse_name ?? warehouse.warehouse_code}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-lg border bg-white px-3 text-sm"
        value={searchParams.get("guest_method") ?? "total_guests"}
        onChange={(event) => updateFilter("guest_method", event.target.value)}
      >
        <option value="total_guests">Total Guests</option>
        <option value="equivalent_guests">Equivalent Guests</option>
      </select>
    </section>
  );
}