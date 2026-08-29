import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;
  // اسم آمن فقط: hex + امتداد معروف
  if (!/^[0-9a-f]{16}\.(png|jpg|webp|svg)$/.test(name)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const filePath = path.join(process.cwd(), "data", "uploads", name);
  try {
    const buffer = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": TYPES[path.extname(name)] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
}
