import Link from "next/link";
import { LogoutButton } from "@/components/layout/logout-button";

const menuItems = [
  { label: "Overview", href: "/dashboard/overview" },
  { label: "Cost Trend", href: "/dashboard/cost-trend" },
  { label: "12-Month Trend", href: "/dashboard/trend-comparison" },
  { label: "Consumption Trend", href: "/dashboard/consumption-trend" },
  { label: "Guest Efficiency", href: "/dashboard/guest-efficiency" },
  { label: "Cost Drivers", href: "/dashboard/cost-drivers" },
  { label: "Alerts", href: "/dashboard/alerts" },
];

export function Sidebar() {
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-64
        flex-col
        border-r
        border-slate-200
        bg-white
      "
    >
      <div className="border-b p-4">
        <h2 className="font-bold">Hotel Cost Controller</h2>
      </div>

      <nav className="flex flex-1 flex-col p-2">
        <div>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                block
                rounded-md
                px-3
                py-2
                text-sm
                hover:bg-slate-100
              "
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto border-t pt-3">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}