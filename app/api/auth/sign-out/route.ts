import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
}
