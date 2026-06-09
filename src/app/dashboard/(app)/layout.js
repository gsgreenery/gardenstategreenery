import { redirect } from "next/navigation";
import DashboardShell from "../DashboardShell";
import { getDashboardCookieSession, getDashboardSessionEmployee } from "../auth";

export const metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export const dynamic = "force-dynamic";

export default async function ProtectedDashboardLayout({ children }) {
  const session = await getDashboardCookieSession();
  const employee = await getDashboardSessionEmployee(session);

  if (!employee) {
    redirect("/dashboard/login");
  }

  return <DashboardShell employee={employee}>{children}</DashboardShell>;
}
