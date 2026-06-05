"use client";

import { useRouter, useSearchParams } from "next/navigation";

type FilterOption = {
  value: string;
  label: string;
};

type Props = {
  selectedFilters: {
    usedMonth: string;
    hotelCode?: string;
    warehouseCode?: string;
    guestMethod?: string;
  };
  options: {
    months: FilterOption[];
    hotels: FilterOption[];
    warehouses: FilterOption[];
    guestMethods: FilterOption[];
  };
};

export function CostDriverFilters({ selectedFilters, options }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/dashboard/cost-drivers?${params.toString()}`);
  }

  return (
    <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
      <select
        className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a]"
        value={selectedFilters.usedMonth}
        onChange={(event) => updateFilter("usedMonth", event.target.value)}
      >
        {options.months.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a]"
        value={selectedFilters.hotelCode ?? ""}
        onChange={(event) => updateFilter("hotelCode", event.target.value)}
      >
        <option value="">All Hotels</option>
        {options.hotels.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a]"
        value={selectedFilters.warehouseCode ?? ""}
        onChange={(event) => updateFilter("warehouseCode", event.target.value)}
      >
        <option value="">All Warehouses</option>
        {options.warehouses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a]"
        value={selectedFilters.guestMethod ?? "total_guests"}
        onChange={(event) => updateFilter("guestMethod", event.target.value)}
      >
        {options.guestMethods.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </section>
  );
}