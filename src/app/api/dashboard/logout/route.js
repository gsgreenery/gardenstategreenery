import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "../../../dashboard/auth";

function clearSession(request) {
  const response = NextResponse.redirect(new URL("/dashboard/login", request.url), {
    status: 303,
  });

  response.cookies.set(DASHBOARD_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export async function POST(request) {
  return clearSession(request);
}

export async function GET(request) {
  return clearSession(request);
}
