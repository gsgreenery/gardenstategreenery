import { NextResponse } from "next/server";
import {
  DASHBOARD_COOKIE,
  createDashboardSession,
  getSessionCookieOptions,
  hasDashboardSecret,
  verifyDashboardLogin,
} from "../../../dashboard/auth";

export async function POST(request) {
  const formData = await request.formData();
  const employeeSlug = String(formData.get("employee") || "").toLowerCase();
  const password = String(formData.get("password") || "");

  if (!hasDashboardSecret()) {
    return NextResponse.redirect(new URL("/dashboard/login?error=config", request.url), {
      status: 303,
    });
  }

  const employee = await verifyDashboardLogin(employeeSlug, password);

  if (!employee) {
    return NextResponse.redirect(new URL("/dashboard/login?error=invalid", request.url), {
      status: 303,
    });
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url), { status: 303 });
  response.cookies.set(
    DASHBOARD_COOKIE,
    await createDashboardSession(employee.slug),
    getSessionCookieOptions(),
  );

  return response;
}
