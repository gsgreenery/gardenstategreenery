import { NextResponse } from "next/server";
import { getDashboardCookieSession, getDashboardSessionEmployee } from "../../../dashboard/auth";
import {
  isSupabaseDashboardConfigured,
  mutateDashboardData,
  readDashboardData,
} from "../../../dashboard/supabaseDashboard";

async function getDashboardActor() {
  const session = await getDashboardCookieSession();

  return getDashboardSessionEmployee(session);
}

export async function GET() {
  const actor = await getDashboardActor();

  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseDashboardConfigured()) {
    return NextResponse.json({ configured: false });
  }

  try {
    return NextResponse.json({
      configured: true,
      data: await readDashboardData(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load dashboard data." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const actor = await getDashboardActor();

  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseDashboardConfigured()) {
    return NextResponse.json({ configured: false }, { status: 501 });
  }

  try {
    const mutation = await request.json();

    return NextResponse.json({
      configured: true,
      data: await mutateDashboardData(actor, mutation),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save dashboard data." },
      { status: 500 },
    );
  }
}
