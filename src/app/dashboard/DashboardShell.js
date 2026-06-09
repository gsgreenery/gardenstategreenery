"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardDataProvider } from "./DashboardDataProvider";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/expenses", label: "Expenses" },
  { href: "/dashboard/schedule", label: "Schedule" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/blacklist", label: "Blacklist" },
  { href: "/dashboard/notes", label: "Crew Notes" },
  { href: "/dashboard/equipment", label: "Equipment" },
  { href: "/dashboard/marketing", label: "Marketing" },
  { href: "/dashboard/employees", label: "Employees" },
  { href: "/dashboard/audit", label: "Audit Log" },
];

export default function DashboardShell({ children, employee }) {
  const pathname = usePathname();
  const currentPage = navItems.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <DashboardDataProvider actor={employee}>
      <main className="ops-shell">
        <aside className="ops-sidebar" aria-label="Employee dashboard navigation">
          <Link className="ops-brand" href="/" aria-label="Garden State Greenery home">
            <span className="ops-brand-mark">GSG</span>
            <span>
              <strong>Garden State Greenery</strong>
              <small>Employee ops</small>
            </span>
          </Link>

          <nav className="ops-nav">
            {navItems.map((item) => (
              <Link
                className={pathname === item.href ? "is-active" : ""}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action="/api/dashboard/logout" method="post">
            <button className="ops-logout" type="submit">
              Log out
            </button>
          </form>
        </aside>

        <section className="ops-main">
          <header className="ops-topbar">
            <div className="ops-topbar-title">
              <span>Employee dashboard</span>
              <strong>{currentPage}</strong>
            </div>
            <div className="ops-topbar-actions">
              <p className="ops-user-chip">
                Signed in as <strong>{employee.name}</strong>
              </p>
              <form action="/api/dashboard/logout" method="post">
                <button className="ops-logout" type="submit">
                  Log out
                </button>
              </form>
            </div>
          </header>

          {children}
        </section>
      </main>
    </DashboardDataProvider>
  );
}
