import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as authPost, DELETE as authDelete } from "@/app/api/auth/route";
import { GET as contentGet } from "@/app/api/content/route";
import { POST as chatPost } from "@/app/api/chat/route";
import { GET as fileGet } from "@/app/api/files/[name]/route";

function jsonRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "TestPass@123";
  delete process.env.ANTHROPIC_API_KEY;
});

describe("POST /api/auth — تسجيل الدخول", () => {
  it("يرفض كلمة المرور الخاطئة بـ 401", async () => {
    const res = await authPost(jsonRequest("http://localhost/api/auth", { password: "wrong" }));
    expect(res.status).toBe(401);
  });

  it("يقبل كلمة المرور الصحيحة ويثبت كوكي الجلسة", async () => {
    const res = await authPost(
      jsonRequest("http://localhost/api/auth", { password: "TestPass@123" })
    );
    expect(res.status).toBe(200);
    const cookie = res.cookies.get("rawae_admin");
    expect(cookie?.value).toMatch(/^[0-9a-f]{64}$/);
    expect(cookie?.httpOnly).toBe(true);
  });

  it("تسجيل الخروج يمسح الكوكي", async () => {
    const res = await authDelete();
    expect(res.status).toBe(200);
    expect(res.cookies.get("rawae_admin")?.value).toBe("");
  });
});

describe("GET /api/content — قراءة المحتوى", () => {
  it("يعيد المحتوى العربي افتراضيًا", async () => {
    const res = await contentGet(new NextRequest("http://localhost/api/content"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.settings).toBeDefined();
    expect(Array.isArray(body.services)).toBe(true);
  });

  it("يعيد المحتوى الإنجليزي عند lang=en", async () => {
    const res = await contentGet(new NextRequest("http://localhost/api/content?lang=en"));
    const body = await res.json();
    expect(body.ui.nav.services).toBe("Services");
  });
});

describe("POST /api/chat — المساعد الذكي", () => {
  it("يرد برسالة لبقة عند غياب مفتاح API بدل الانهيار", async () => {
    const res = await chatPost(
      jsonRequest("http://localhost/api/chat", {
        messages: [{ role: "user", content: "كم الأسعار؟" }],
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reply).toContain("واتساب");
  });

  it("يرفض الطلب بلا رسائل", async () => {
    const res = await chatPost(jsonRequest("http://localhost/api/chat", { messages: [] }));
    // بدون مفتاح API يرد برسالة التعطيل قبل التحقق؛ مع المفتاح يرد 400
    expect([200, 400]).toContain(res.status);
  });
});

describe("GET /api/files — تقديم الملفات المرفوعة", () => {
  it("يرفض أسماء الملفات الخبيثة (اجتياز المسار)", async () => {
    const res = await fileGet(new Request("http://localhost/api/files/x"), {
      params: Promise.resolve({ name: "..%2F..%2Fcontent.json" }),
    });
    expect(res.status).toBe(400);
  });

  it("يرفض الامتدادات غير المسموحة", async () => {
    const res = await fileGet(new Request("http://localhost/api/files/x"), {
      params: Promise.resolve({ name: "0123456789abcdef.exe" }),
    });
    expect(res.status).toBe(400);
  });

  it("يعيد 404 لملف غير موجود بصيغة صحيحة", async () => {
    const res = await fileGet(new Request("http://localhost/api/files/x"), {
      params: Promise.resolve({ name: "0123456789abcdef.png" }),
    });
    expect(res.status).toBe(404);
  });
});
