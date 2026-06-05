"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { AlertFilterOptions, AlertSearchParams } from "@/types/alerts";

type Props = {
  filterOptions: AlertFilterOptions;
  selectedFilters: AlertSearchParams;
};

export function AlertFilters({ filterOptions, selectedFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key === "hotelCode") {
      params.delete("warehouseCode");
    }

    router.push(`/dashboard/alerts?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/dashboard/alerts");
  }

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-5">
      <select
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
        value={selectedFilters.usedMonth ?? ""}
        onChange={(event) => updateFilter("usedMonth", event.target.value)}
      >
        <option value="">All Months</option>
        {filterOptions.months.map((month) => (
          <option key={month} value={month}>
            {month.slice(0, 7)}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
        value={selectedFilters.hotelCode ?? ""}
        onChange={(event) => updateFilter("hotelCode", event.target.value)}
      >
        <option value="">All Hotels</option>
        {filterOptions.hotels.map((hotel) => (
          <option key={hotel.hotelCode} value={hotel.hotelCode}>
            {hotel.hotelName}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
        value={selectedFilters.warehouseCode ?? ""}
        onChange={(event) => updateFilter("warehouseCode", event.target.value)}
      >
        <option value="">All Warehouses</option>
        {filterOptions.warehouses.map((warehouse) => (
          <option key={warehouse.warehouseCode} value={warehouse.warehouseCode}>
            {warehouse.warehouseName}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
        value={selectedFilters.guestMethod ?? "total"}
        onChange={(event) => updateFilter("guestMethod", event.target.value)}
      >
        <option value="total">Total Guests</option>
        <option value="adult">Adults</option>
        <option value="child">Children</option>
      </select>

      <button
        type="button"
        onClick={clearFilters}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-blue-600"
      >
        Clear Filters
      </button>
    </section>
  );
}