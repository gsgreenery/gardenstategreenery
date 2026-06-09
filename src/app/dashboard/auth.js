import { cookies } from "next/headers";
import { employeeProfiles } from "./employees";

export const DASHBOARD_COOKIE = "gsg_dashboard_session";

export const dashboardEmployees = employeeProfiles;

const SESSION_SALT = "garden-state-greenery-dashboard-v2";
const SESSION_MAX_AGE = 60 * 60 * 12;

function getEmployeeSecret(employeeSlug) {
  const employee = dashboardEmployees.find((item) => item.slug === employeeSlug);

  if (!employee) {
    return "";
  }

  return process.env[employee.env] || "";
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function hasDashboardSecret() {
  return dashboardEmployees.some((employee) => Boolean(getEmployeeSecret(employee.slug)));
}

export function getDashboardEmployeeOptions() {
  return dashboardEmployees.map(({ env, name, slug }) => ({ env, name, slug }));
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

export async function createDashboardSession(employeeSlug) {
  const secret = getEmployeeSecret(employeeSlug);

  if (!secret) {
    return "";
  }

  return `v2.${employeeSlug}.${await sha256(`${SESSION_SALT}:${employeeSlug}:${secret}`)}`;
}

export async function verifyDashboardLogin(employeeSlug, password) {
  const employee = dashboardEmployees.find((item) => item.slug === employeeSlug);
  const secret = getEmployeeSecret(employeeSlug);

  if (!employee || !secret || password !== secret) {
    return null;
  }

  return { name: employee.name, slug: employee.slug };
}

export async function getDashboardSessionEmployee(session) {
  const [version, employeeSlug] = String(session || "").split(".");

  if (version !== "v2" || !employeeSlug) {
    return null;
  }

  const expectedSession = await createDashboardSession(employeeSlug);
  const employee = dashboardEmployees.find((item) => item.slug === employeeSlug);

  if (!employee || !expectedSession || session !== expectedSession) {
    return null;
  }

  return { name: employee.name, slug: employee.slug };
}

export async function isDashboardSessionValid(session) {
  return Boolean(await getDashboardSessionEmployee(session));
}

export async function getDashboardCookieSession() {
  const cookieStore = await cookies();

  return cookieStore.get(DASHBOARD_COOKIE)?.value || "";
}
