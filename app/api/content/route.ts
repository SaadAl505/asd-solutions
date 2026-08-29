import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, type SiteContent, type Lang } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

function langFrom(request: NextRequest): Lang {
  return request.nextUrl.searchParams.get("lang") === "en" ? "en" : "ar";
}

export async function GET(request: NextRequest) {
  const content = await getContent(langFrom(request));
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  }
  const body = (await request.json()) as SiteContent;
  if (!body || typeof body !== "object" || !body.settings) {
    return NextResponse.json({ ok: false, error: "بيانات غير صالحة" }, { status: 400 });
  }
  await saveContent(body, langFrom(request));
  return NextResponse.json({ ok: true });
}
