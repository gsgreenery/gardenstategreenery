import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getDashboardEmployeeOptions,
  getDashboardCookieSession,
  getDashboardSessionEmployee,
  hasDashboardSecret,
} from "../auth";

export const metadata = {
  title: "Employee Login | Garden State Greenery",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function DashboardLoginPage({ searchParams }) {
  const session = await getDashboardCookieSession();

  if (await getDashboardSessionEmployee(session)) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = params?.error;
  const employeeOptions = getDashboardEmployeeOptions();
  const secretConfigured = hasDashboardSecret();

  return (
    <main className="dashboard-login-shell">
      <section className="dashboard-login-card" aria-labelledby="dashboard-login-title">
        <Link className="dashboard-login-brand" href="/" aria-label="Garden State Greenery home">
          <Image
            src="/squareicongreen.png?v=1"
            alt=""
            width={52}
            height={52}
            className="dashboard-login-logo"
            unoptimized
          />
          <span>
            <strong>Garden State Greenery</strong>
            <small>Employee dashboard</small>
          </span>
        </Link>

        <div>
          <p className="dashboard-kicker">Private access</p>
          <h1 id="dashboard-login-title">Sign in to manage the route.</h1>
          <p>
            Use the employee passcode to view jobs, money, schedules, customers, equipment,
            notes, and marketing tracking.
          </p>
        </div>

        {error === "invalid" ? (
          <p className="dashboard-login-error">That passcode did not match.</p>
        ) : null}

        {error === "config" || !secretConfigured ? (
          <p className="dashboard-login-error">
            Set the five employee password variables before employees can log in.
          </p>
        ) : null}

        <form className="dashboard-login-form" action="/api/dashboard/login" method="post">
          <label>
            Employee
            <select name="employee" defaultValue="lucas">
              {employeeOptions.map((employee) => (
                <option key={employee.slug} value={employee.slug}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Employee passcode
            <input
              autoComplete="current-password"
              name="password"
              placeholder="Enter passcode"
              type="password"
            />
          </label>
          <button className="dashboard-primary-button" type="submit">
            Open dashboard
          </button>
        </form>
      </section>
    </main>
  );
}
