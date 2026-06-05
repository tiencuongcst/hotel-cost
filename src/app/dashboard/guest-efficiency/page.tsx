import { GuestCostPerformanceDashboard } from "@/components/guest-efficiency/guest-cost-performance-dashboard";
import { getGuestEfficiencyDashboardData } from "@/modules/guest-efficiency/guest-efficiency.service";

type PageProps = {
  searchParams: Promise<{
    period?: string;
    hotel?: string;
    warehouse?: string;
    guestMethod?: string;
  }>;
};

export default async function GuestEfficiencyPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const data = await getGuestEfficiencyDashboardData({
    period: params.period,
    hotel: params.hotel,
    warehouse: params.warehouse,
    guestMethod: params.guestMethod,
  });

  return <GuestCostPerformanceDashboard initialData={data} />;
}