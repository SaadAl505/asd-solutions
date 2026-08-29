import { describe, it, expect } from "vitest";
import { discountedPrice, waLink, DEFAULT_UI, getContent } from "@/lib/content";
import { verifyPassword, sessionToken } from "@/lib/auth";

describe("discountedPrice — حساب الخصم", () => {
  it("يحسب خصم 15% على 1000 = 850", () => {
    expect(discountedPrice("1000", 15)).toBe("850");
  });

  it("يتعامل مع الفواصل في السعر (2,000)", () => {
    expect(discountedPrice("2,000", 50)).toBe("1,000");
  });

  it("يعيد null بدون خصم", () => {
    expect(discountedPrice("1000")).toBeNull();
    expect(discountedPrice("1000", 0)).toBeNull();
  });

  it("يرفض النسب غير المنطقية", () => {
    expect(discountedPrice("1000", -5)).toBeNull();
    expect(discountedPrice("1000", 100)).toBeNull();
    expect(discountedPrice("1000", 150)).toBeNull();
  });

  it("يرفض الأسعار غير الرقمية", () => {
    expect(discountedPrice("مجانًا", 15)).toBeNull();
    expect(discountedPrice("", 15)).toBeNull();
  });

  it("يقرب الناتج لأقرب عدد صحيح", () => {
    expect(discountedPrice("999", 15)).toBe("849"); // 849.15 → 849
  });
});

describe("waLink — روابط واتساب", () => {
  it("يبني رابط wa.me صحيحًا مع ترميز الرسالة", () => {
    const link = waLink("966500000000", "مرحبًا بكم");
    expect(link).toContain("https://wa.me/966500000000?text=");
    expect(link).toContain(encodeURIComponent("مرحبًا بكم"));
  });
});

describe("getContent — قراءة المحتوى ودمج النصوص", () => {
  it("يقرأ المحتوى العربي ويكمل نصوص الواجهة الناقصة بالافتراضية", async () => {
    const c = await getContent("ar");
    expect(c.settings.siteName.length).toBeGreaterThan(0);
    expect(c.ui.nav.services.length).toBeGreaterThan(0);
    expect(c.ui.steps.length).toBeGreaterThan(0);
    expect(Object.keys(c.ui.sections)).toEqual(
      expect.arrayContaining(["services", "pricing", "faq"])
    );
  });

  it("يقرأ المحتوى الإنجليزي بواجهته الخاصة", async () => {
    const c = await getContent("en");
    expect(c.ui.nav.services).toBe("Services");
    expect(c.settings.tagline).toContain("AI");
  });

  it("النصوص الافتراضية مكتملة البنية", () => {
    expect(DEFAULT_UI.steps).toHaveLength(3);
    expect(DEFAULT_UI.hero.titleLine.length).toBeGreaterThan(0);
    expect(DEFAULT_UI.cta.btnWhatsapp.length).toBeGreaterThan(0);
  });
});

describe("auth — منطق الدخول", () => {
  it("يرفض كلمة مرور خاطئة ويقبل الصحيحة", () => {
    process.env.ADMIN_PASSWORD = "TestPass@123";
    expect(verifyPassword("wrong")).toBe(false);
    expect(verifyPassword("TestPass@123")).toBe(true);
  });

  it("رمز الجلسة ثابت لنفس كلمة المرور ومختلف لغيرها", () => {
    process.env.ADMIN_PASSWORD = "TestPass@123";
    const a = sessionToken();
    const b = sessionToken();
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    process.env.ADMIN_PASSWORD = "Another@456";
    expect(sessionToken()).not.toBe(a);
  });
});
