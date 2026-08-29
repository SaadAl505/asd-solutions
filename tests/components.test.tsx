import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogoFull, LogoMark } from "@/components/logo";
import ChatWidget from "@/components/chat-widget";
import SiteNav from "@/components/site-nav";
import { Icon, ICON_NAMES } from "@/components/icons";

describe("الشعار", () => {
  it("يعرض اسم الموقع كاملًا", () => {
    render(<LogoFull name="ASD Solutions" />);
    expect(screen.getByText("ASD")).toBeInTheDocument();
    expect(screen.getByText("Solutions")).toBeInTheDocument();
  });

  it("علامة الشعار ترسم بدون أخطاء", () => {
    const { container } = render(<LogoMark size={40} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("مكتبة الأيقونات", () => {
  it("كل أيقونة معرفة ترسم SVG", () => {
    for (const name of ICON_NAMES) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
      unmount();
    }
  });

  it("الاسم المجهول يرجع أيقونة احتياطية بدل الانهيار", () => {
    const { container } = render(<Icon name="does-not-exist" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("المساعد الذكي", () => {
  it("يفتح نافذة المحادثة عند الضغط ويعرض الأسئلة المقترحة", async () => {
    const user = userEvent.setup();
    render(<ChatWidget siteName="ASD Solutions" />);

    await user.click(screen.getByRole("button", { name: "فتح المساعد الذكي" }));

    expect(screen.getByLabelText("المساعد الذكي")).toBeInTheDocument();
    expect(screen.getByText("ما هي خدماتكم؟")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("اكتب سؤالك هنا...")).toBeInTheDocument();
  });

  it("زر الإرسال معطل والحقل فارغ", async () => {
    const user = userEvent.setup();
    render(<ChatWidget siteName="ASD" />);
    await user.click(screen.getByRole("button", { name: "فتح المساعد الذكي" }));
    expect(screen.getByRole("button", { name: "إرسال" })).toBeDisabled();
  });
});

describe("شريط التنقل", () => {
  const labels = { services: "خدماتنا", pricing: "الأسعار", clients: "شركاؤنا", faq: "الأسئلة", cta: "ابدأ مشروعك" };

  it("يعرض الروابط وزر اللغة", () => {
    render(
      <SiteNav siteName="ASD Solutions" labels={labels} waHref="https://wa.me/1" langHref="/en" langLabel="EN" />
    );
    expect(screen.getByText("خدماتنا")).toBeInTheDocument();
    expect(screen.getByText("الأسعار")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("قائمة الجوال تفتح وتغلق", async () => {
    const user = userEvent.setup();
    render(<SiteNav siteName="ASD" labels={labels} waHref="https://wa.me/1" />);
    const burger = screen.getByLabelText("فتح القائمة");
    await user.click(burger);
    expect(screen.getByLabelText("إغلاق القائمة")).toBeInTheDocument();
  });
});
