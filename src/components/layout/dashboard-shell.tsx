import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

type Props = {
  children: ReactNode;
};

export function DashboardShell({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
