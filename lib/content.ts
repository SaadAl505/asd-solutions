import { promises as fs } from "fs";
import path from "path";

export type Settings = {
  siteName: string;
  tagline: string;
  description: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  twitter: string;
  city: string;
  workHours: string;
  announcement: { enabled: boolean; text: string };
};

export type Stat = { id: string; label: string; value: string };
export type Service = { id: string; icon: string; title: string; description: string };
export type Offer = {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  active: boolean;
};
export type Package = {
  id: string;
  title: string;
  price: string;
  unit: string;
  features: string[];
  featured: boolean;
  badgeText: string;
  /** نسبة الخصم المئوية (0 أو غير معرفة = لا خصم) */
  discount?: number;
};

/** يحسب السعر بعد الخصم — يعيد null إن لم يكن هناك خصم صالح */
export function discountedPrice(price: string, discount?: number): string | null {
  const d = discount ?? 0;
  if (!d || d <= 0 || d >= 100) return null;
  const n = parseFloat(price.replace(/[^\d.]/g, ""));
  if (isNaN(n) || n <= 0) return null;
  return Math.round(n * (1 - d / 100)).toLocaleString("en-US");
}
export type PortfolioItem = { id: string; title: string; category: string; url: string; image: string };
export type Client = { id: string; name: string; logo: string };
export type Testimonial = { id: string; name: string; role: string; text: string; rating: number };
export type FaqItem = { id: string; q: string; a: string };

export type UiStep = { title: string; desc: string };
export type UiSection = { eyebrow: string; title: string; subtitle?: string };

export type UiTexts = {
  nav: { services: string; pricing: string; clients: string; faq: string; cta: string };
  hero: { titleLine: string; titleGrad: string; ctaPrimary: string; ctaSecondary: string };
  sections: {
    services: UiSection;
    clients: UiSection;
    offers: UiSection;
    steps: UiSection;
    pricing: UiSection;
    portfolio: UiSection;
    testimonials: UiSection;
    faq: UiSection;
  };
  steps: UiStep[];
  buttons: { offer: string; package: string };
  cta: { title: string; titleGrad: string; desc: string; btnWhatsapp: string };
  footer: { tagline: string; rights: string };
};

export const DEFAULT_UI: UiTexts = {
  nav: { services: "خدماتنا", pricing: "الأسعار", clients: "شركاؤنا", faq: "الأسئلة", cta: "ابدأ مشروعك" },
  hero: {
    titleLine: "نصنع مستقبلك",
    titleGrad: "الرقمي",
    ctaPrimary: "اطلب استشارة مجانية",
    ctaSecondary: "استعرض خدماتنا",
  },
  sections: {
    services: { eyebrow: "خدماتنا", title: "حلول تقنية متكاملة من فريق واحد", subtitle: "نرافق نشاطك من أول فكرة إلى الإطلاق — بجودة عالية وأسعار منافسة." },
    clients: { eyebrow: "شركاء النجاح", title: "أنشطة تجارية وثقت بنا" },
    offers: { eyebrow: "عروضنا الحالية", title: "عروض لا تُفوَّت" },
    steps: { eyebrow: "آلية العمل", title: "ثلاث خطوات، ومشروعك يعمل" },
    pricing: { eyebrow: "الباقات والأسعار", title: "أسعار ثابتة معلنة. لا رسوم خفية." },
    portfolio: { eyebrow: "من أعمالنا", title: "أعمال نفخر بها" },
    testimonials: { eyebrow: "آراء عملائنا", title: "ثقة نعتز بها" },
    faq: { eyebrow: "الأسئلة الشائعة", title: "كل ما تحتاج معرفته" },
  },
  steps: [
    { title: "تواصل معنا", desc: "رسالة واتساب واحدة تكفي — نتفق على الخدمات والمحتوى في اليوم نفسه." },
    { title: "ادفع الدفعة الأولى", desc: "50% مقدمًا عبر تحويل بنكي أو STC Pay، والمبلغ المتبقي عند الاستلام." },
    { title: "استلم في موعدك", desc: "الموقع في وقت قياسي، والتصاميم ملفات جاهزة للمطبعة — دون تأخير." },
  ],
  buttons: { offer: "أرغب في هذا العرض", package: "اطلب الباقة" },
  cta: {
    title: "جاهز تنقل نشاطك إلى",
    titleGrad: "المستوى التالي؟",
    desc: "أرسل إلينا اسم نشاطك الآن، واحصل على استشارة مجانية وخطة واضحة خلال يوم واحد.",
    btnWhatsapp: "تواصل عبر واتساب",
  },
  footer: { tagline: "حلول تقنية تليق بالأنشطة السعودية", rights: "جميع الحقوق محفوظة" },
};

export type SiteContent = {
  settings: Settings;
  stats: Stat[];
  services: Service[];
  offers: Offer[];
  packages: Package[];
  portfolio: PortfolioItem[];
  clients: Client[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  ui: UiTexts;
};

export type Lang = "ar" | "en";

function contentPathFor(lang: Lang): string {
  return path.join(process.cwd(), "data", lang === "en" ? "content.en.json" : "content.json");
}

const contentPath = contentPathFor("ar");

/** دمج عميق: القيم المحفوظة فوق الافتراضية — حتى لا تنكسر الملفات القديمة */
function mergeUi(stored?: Partial<UiTexts>): UiTexts {
  if (!stored) return DEFAULT_UI;
  return {
    nav: { ...DEFAULT_UI.nav, ...stored.nav },
    hero: { ...DEFAULT_UI.hero, ...stored.hero },
    sections: Object.fromEntries(
      Object.entries(DEFAULT_UI.sections).map(([k, v]) => [
        k,
        { ...v, ...(stored.sections?.[k as keyof UiTexts["sections"]] ?? {}) },
      ])
    ) as UiTexts["sections"],
    steps:
      stored.steps && stored.steps.length > 0 ? stored.steps : DEFAULT_UI.steps,
    buttons: { ...DEFAULT_UI.buttons, ...stored.buttons },
    cta: { ...DEFAULT_UI.cta, ...stored.cta },
    footer: { ...DEFAULT_UI.footer, ...stored.footer },
  };
}

export async function getContent(lang: Lang = "ar"): Promise<SiteContent> {
  const raw = await fs.readFile(contentPathFor(lang), "utf-8");
  const parsed = JSON.parse(raw) as SiteContent;
  parsed.ui = mergeUi(parsed.ui);
  return parsed;
}

export async function saveContent(content: SiteContent, lang: Lang = "ar"): Promise<void> {
  await fs.writeFile(contentPathFor(lang), JSON.stringify(content, null, 2), "utf-8");
}

export function waLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
