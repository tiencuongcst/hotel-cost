import {
  getCostDriversDashboard,
  getCostDriverFilterOptions,
} from "@/services/cost-drivers";
import { CostDriversDashboard } from "@/components/cost-drivers/cost-drivers-dashboard";

type PageProps = {
  searchParams: Promise<{
    usedMonth?: string;
    hotelCode?: string;
    warehouseCode?: string;
    guestMethod?: string;
  }>;
};

export default async function CostDriversPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filterOptions = await getCostDriverFilterOptions();

  const usedMonth =
    params.usedMonth ??
    filterOptions.months[0]?.value ??
    "2026-03-01";

  const data = await getCostDriversDashboard({
    usedMonth,
    hotelCode: params.hotelCode,
    warehouseCode: params.warehouseCode,
    guestMethod: params.guestMethod ?? "total_guests",
  });

  return (
    <CostDriversDashboard
      data={data}
      filterOptions={filterOptions}
      selectedFilters={{
        usedMonth,
        hotelCode: params.hotelCode,
        warehouseCode: params.warehouseCode,
        guestMethod: params.guestMethod ?? "total_guests",
      }}
    />
  );
}