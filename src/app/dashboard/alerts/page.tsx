import { AlertsDashboard } from "@/components/alerts/alerts-dashboard";
import { getAlertsDashboard } from "@/services/alerts.service";
import type { AlertSearchParams } from "@/types/alerts";

type AlertsPageProps = {
  searchParams: Promise<AlertSearchParams>;
};

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const params = await searchParams;

  const data = await getAlertsDashboard({
    usedMonth: params.usedMonth,
    hotelCode: params.hotelCode,
    warehouseCode: params.warehouseCode,
    guestMethod: params.guestMethod ?? "total",
  });

  return (
    <AlertsDashboard
      data={data}
      selectedFilters={{
        usedMonth: params.usedMonth,
        hotelCode: params.hotelCode,
        warehouseCode: params.warehouseCode,
        guestMethod: params.guestMethod ?? "total",
      }}
    />
  );
}