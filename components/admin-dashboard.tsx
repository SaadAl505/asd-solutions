"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  SiteContent, Service, Offer, Package, PortfolioItem, Client, Testimonial, FaqItem, Stat,
} from "@/lib/content";
import { Icon, ICON_NAMES } from "@/components/icons";
import { LogoMark } from "@/components/logo";

const TABS = [
  { key: "settings", label: "الإعدادات العامة" },
  { key: "texts", label: "نصوص الموقع" },
  { key: "services", label: "الخدمات" },
  { key: "offers", label: "العروض" },
  { key: "packages", label: "الباقات والأسعار" },
  { key: "clients", label: "عملاؤنا" },
  { key: "portfolio", label: "الأعمال" },
  { key: "testimonials", label: "آراء العملاء" },
  { key: "faq", label: "الأسئلة الشائعة" },
  { key: "stats", label: "الإحصائيات" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function newId(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}

/* ---------- عناصر مساعدة ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className="switch"
      data-on={on}
      onClick={() => onChange(!on)}
      aria-pressed={on}
      aria-label={on ? "مفعّل" : "معطّل"}
    />
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {ICON_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          title={name}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            border: value === name ? "2px solid var(--violet)" : "1px solid rgba(23,23,26,0.1)",
            background: value === name ? "rgba(139,92,246,0.1)" : "var(--surface)",
            color: "var(--ink)",
          }}
        >
          <Icon name={name} size={20} />
        </button>
      ))}
    </div>
  );
}

function UploadInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setBusy(false);
    if (res.ok && data.url) onChange(data.url);
    else setErr(data.error || "تعذّر رفع الملف");
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" style={{ height: 40, maxWidth: 110, objectFit: "contain", background: "var(--surface-2)", borderRadius: 10, padding: 4, border: "1px solid var(--border)" }} />
        )}
        <label className="btn btn-glass btn-sm" style={{ cursor: "pointer" }}>
          {busy ? "جارٍ الرفع..." : value ? "استبدال الصورة" : "رفع صورة"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <button type="button" className="btn btn-glass btn-sm" style={{ color: "var(--danger)" }} onClick={() => onChange("")}>
            إزالة
          </button>
        )}
      </div>
      {err && <p style={{ color: "var(--danger)", fontSize: 12.5 }}>{err}</p>}
    </div>
  );
}

function ItemCard({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <div className="admin-card" style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
      <button
        type="button"
        onClick={onDelete}
        aria-label="حذف العنصر"
        style={{
          position: "absolute", top: 14, insetInlineEnd: 14,
          background: "rgba(220,38,38,0.08)", color: "var(--danger)",
          border: 0, borderRadius: 10, padding: "5px 12px",
          fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        حذف
      </button>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="btn btn-glass btn-sm" onClick={onClick} style={{ alignSelf: "flex-start" }}>
      + {label}
    </button>
  );
}

/* ---------- اللوحة الرئيسية ---------- */

export default function Dashboard({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<TabKey>("settings");
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  async function switchLang(next: "ar" | "en") {
    if (next === lang) return;
    const res = await fetch(`/api/content?lang=${next}`);
    if (res.ok) {
      setContent(await res.json());
      setLang(next);
    }
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/content?lang=${lang}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setToast(
      res.ok
        ? { text: "تم حفظ التغييرات بنجاح ✓", ok: true }
        : { text: "تعذّر الحفظ، يرجى المحاولة مجددًا", ok: false }
    );
    setTimeout(() => setToast(null), 3000);
    if (res.ok) router.refresh();
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const s = content.settings;

  return (
    <main style={{ minHeight: "100vh", padding: "26px 18px 90px", maxWidth: 980, margin: "0 auto" }}>
      {/* الترويسة */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark size={38} />
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 700 }}>لوحة تحكم روائع الحلول</h1>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>إدارة محتوى الموقع بالكامل</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", border: "1px solid var(--border-strong)", borderRadius: 999, overflow: "hidden" }}>
            {(["ar", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchLang(l)}
                style={{
                  border: 0, cursor: "pointer", fontFamily: "inherit",
                  fontSize: 12.5, fontWeight: 700, padding: "7px 16px",
                  background: lang === l ? "var(--grad)" : "transparent",
                  color: lang === l ? "#fff" : "var(--ink-2)",
                }}
              >
                {l === "ar" ? "المحتوى العربي" : "English"}
              </button>
            ))}
          </div>
          <a className="btn btn-glass btn-sm" href={lang === "en" ? "/en" : "/"} target="_blank">معاينة الموقع</a>
          <button className="btn btn-glass btn-sm" onClick={logout} style={{ color: "var(--danger)" }}>تسجيل الخروج</button>
        </div>
      </header>

      {/* التبويبات */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className="btn btn-sm"
            style={
              tab === t.key
                ? { background: "var(--grad)", color: "#fff" }
                : { background: "var(--surface)", color: "var(--ink-2)", border: "1px solid var(--border)" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* ===== الإعدادات العامة ===== */}
        {tab === "settings" && (
          <>
            <div className="admin-card" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              <Field label="اسم الموقع">
                <input className="input" value={s.siteName} onChange={(e) => patch("settings", { ...s, siteName: e.target.value })} />
              </Field>
              <Field label="الشعار التعريفي (السطر العلوي)">
                <input className="input" value={s.tagline} onChange={(e) => patch("settings", { ...s, tagline: e.target.value })} />
              </Field>
              <Field label="رقم واتساب (بصيغة دولية دون +)">
                <input className="input" dir="ltr" value={s.whatsapp} onChange={(e) => patch("settings", { ...s, whatsapp: e.target.value })} />
              </Field>
              <Field label="رقم الهاتف">
                <input className="input" dir="ltr" value={s.phone} onChange={(e) => patch("settings", { ...s, phone: e.target.value })} />
              </Field>
              <Field label="البريد الإلكتروني">
                <input className="input" dir="ltr" value={s.email} onChange={(e) => patch("settings", { ...s, email: e.target.value })} />
              </Field>
              <Field label="المدينة / النطاق الجغرافي">
                <input className="input" value={s.city} onChange={(e) => patch("settings", { ...s, city: e.target.value })} />
              </Field>
              <Field label="ساعات العمل">
                <input className="input" value={s.workHours} onChange={(e) => patch("settings", { ...s, workHours: e.target.value })} />
              </Field>
            </div>
            <div className="admin-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="الوصف التعريفي (يظهر في الواجهة الرئيسية)">
                <textarea className="input" value={s.description} onChange={(e) => patch("settings", { ...s, description: e.target.value })} />
              </Field>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Toggle on={s.announcement.enabled} onChange={(v) => patch("settings", { ...s, announcement: { ...s.announcement, enabled: v } })} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>تفعيل شريط الإعلان أعلى الموقع</span>
              </div>
              <Field label="نص الإعلان">
                <input className="input" value={s.announcement.text} onChange={(e) => patch("settings", { ...s, announcement: { ...s.announcement, text: e.target.value } })} />
              </Field>
            </div>
          </>
        )}

        {/* ===== نصوص الموقع ===== */}
        {tab === "texts" && (() => {
          const ui = content.ui;
          const setUi = (next: typeof ui) => patch("ui", next);
          const SECTION_LABELS: Record<string, string> = {
            services: "قسم الخدمات",
            clients: "قسم الشركاء",
            offers: "قسم العروض",
            steps: "قسم آلية العمل",
            pricing: "قسم الأسعار",
            portfolio: "قسم الأعمال",
            testimonials: "قسم آراء العملاء",
            faq: "قسم الأسئلة الشائعة",
          };
          return (
            <>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
                كل نص يظهر في الموقع قابل للتعديل من هنا — يُحفظ ويظهر مباشرة.
              </p>

              <div className="admin-card" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                <div style={{ gridColumn: "1 / -1", fontWeight: 800, fontSize: 15 }}>القائمة العلوية</div>
                {(["services", "pricing", "clients", "faq", "cta"] as const).map((k) => (
                  <Field key={k} label={k === "cta" ? "زر الإجراء الرئيسي" : `رابط ${SECTION_LABELS[k]?.replace("قسم ", "") ?? k}`}>
                    <input className="input" value={ui.nav[k]} onChange={(e) => setUi({ ...ui, nav: { ...ui.nav, [k]: e.target.value } })} />
                  </Field>
                ))}
              </div>

              <div className="admin-card" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                <div style={{ gridColumn: "1 / -1", fontWeight: 800, fontSize: 15 }}>الواجهة الرئيسية</div>
                <Field label="العنوان (السطر الأول)">
                  <input className="input" value={ui.hero.titleLine} onChange={(e) => setUi({ ...ui, hero: { ...ui.hero, titleLine: e.target.value } })} />
                </Field>
                <Field label="العنوان الملوّن (السطر الثاني)">
                  <input className="input" value={ui.hero.titleGrad} onChange={(e) => setUi({ ...ui, hero: { ...ui.hero, titleGrad: e.target.value } })} />
                </Field>
                <Field label="الزر الرئيسي">
                  <input className="input" value={ui.hero.ctaPrimary} onChange={(e) => setUi({ ...ui, hero: { ...ui.hero, ctaPrimary: e.target.value } })} />
                </Field>
                <Field label="الزر الثانوي">
                  <input className="input" value={ui.hero.ctaSecondary} onChange={(e) => setUi({ ...ui, hero: { ...ui.hero, ctaSecondary: e.target.value } })} />
                </Field>
              </div>

              {(Object.keys(SECTION_LABELS) as (keyof typeof ui.sections)[]).map((key) => (
                <div key={key} className="admin-card" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <div style={{ gridColumn: "1 / -1", fontWeight: 800, fontSize: 15 }}>{SECTION_LABELS[key]}</div>
                  <Field label="التسمية الصغيرة">
                    <input className="input" value={ui.sections[key].eyebrow} onChange={(e) => setUi({ ...ui, sections: { ...ui.sections, [key]: { ...ui.sections[key], eyebrow: e.target.value } } })} />
                  </Field>
                  <Field label="العنوان">
                    <input className="input" value={ui.sections[key].title} onChange={(e) => setUi({ ...ui, sections: { ...ui.sections, [key]: { ...ui.sections[key], title: e.target.value } } })} />
                  </Field>
                  {key === "services" && (
                    <Field label="الوصف (اختياري)">
                      <input className="input" value={ui.sections[key].subtitle ?? ""} onChange={(e) => setUi({ ...ui, sections: { ...ui.sections, [key]: { ...ui.sections[key], subtitle: e.target.value } } })} />
                    </Field>
                  )}
                </div>
              ))}

              <div className="admin-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>خطوات آلية العمل</div>
                {ui.steps.map((st, i) => (
                  <div key={i} style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 2fr auto", alignItems: "end" }}>
                    <Field label={`عنوان الخطوة ${i + 1}`}>
                      <input className="input" value={st.title} onChange={(e) => {
                        const steps = [...ui.steps]; steps[i] = { ...st, title: e.target.value }; setUi({ ...ui, steps });
                      }} />
                    </Field>
                    <Field label="الوصف">
                      <input className="input" value={st.desc} onChange={(e) => {
                        const steps = [...ui.steps]; steps[i] = { ...st, desc: e.target.value }; setUi({ ...ui, steps });
                      }} />
                    </Field>
                    <button type="button" className="btn btn-glass btn-sm" style={{ color: "var(--danger)" }} onClick={() => setUi({ ...ui, steps: ui.steps.filter((_, j) => j !== i) })}>
                      حذف
                    </button>
                  </div>
                ))}
                <AddButton label="إضافة خطوة" onClick={() => setUi({ ...ui, steps: [...ui.steps, { title: "", desc: "" }] })} />
              </div>

              <div className="admin-card" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                <div style={{ gridColumn: "1 / -1", fontWeight: 800, fontSize: 15 }}>الأزرار والقسم الختامي والتذييل</div>
                <Field label="زر العروض">
                  <input className="input" value={ui.buttons.offer} onChange={(e) => setUi({ ...ui, buttons: { ...ui.buttons, offer: e.target.value } })} />
                </Field>
                <Field label="زر الباقات">
                  <input className="input" value={ui.buttons.package} onChange={(e) => setUi({ ...ui, buttons: { ...ui.buttons, package: e.target.value } })} />
                </Field>
                <Field label="عنوان الختام">
                  <input className="input" value={ui.cta.title} onChange={(e) => setUi({ ...ui, cta: { ...ui.cta, title: e.target.value } })} />
                </Field>
                <Field label="عنوان الختام الملوّن">
                  <input className="input" value={ui.cta.titleGrad} onChange={(e) => setUi({ ...ui, cta: { ...ui.cta, titleGrad: e.target.value } })} />
                </Field>
                <Field label="وصف الختام">
                  <input className="input" value={ui.cta.desc} onChange={(e) => setUi({ ...ui, cta: { ...ui.cta, desc: e.target.value } })} />
                </Field>
                <Field label="زر واتساب الختامي">
                  <input className="input" value={ui.cta.btnWhatsapp} onChange={(e) => setUi({ ...ui, cta: { ...ui.cta, btnWhatsapp: e.target.value } })} />
                </Field>
                <Field label="سطر التذييل">
                  <input className="input" value={ui.footer.tagline} onChange={(e) => setUi({ ...ui, footer: { ...ui.footer, tagline: e.target.value } })} />
                </Field>
                <Field label="عبارة الحقوق">
                  <input className="input" value={ui.footer.rights} onChange={(e) => setUi({ ...ui, footer: { ...ui.footer, rights: e.target.value } })} />
                </Field>
              </div>
            </>
          );
        })()}

        {/* ===== الخدمات ===== */}
        {tab === "services" && (
          <>
            {content.services.map((sv, i) => (
              <ItemCard key={sv.id} onDelete={() => patch("services", content.services.filter((x) => x.id !== sv.id))}>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <Field label="عنوان الخدمة">
                    <input className="input" value={sv.title} onChange={(e) => {
                      const arr = [...content.services]; arr[i] = { ...sv, title: e.target.value }; patch("services", arr);
                    }} />
                  </Field>
                  <Field label="الوصف">
                    <input className="input" value={sv.description} onChange={(e) => {
                      const arr = [...content.services]; arr[i] = { ...sv, description: e.target.value }; patch("services", arr);
                    }} />
                  </Field>
                </div>
                <Field label="الأيقونة">
                  <IconPicker value={sv.icon} onChange={(icon) => {
                    const arr = [...content.services]; arr[i] = { ...sv, icon }; patch("services", arr);
                  }} />
                </Field>
              </ItemCard>
            ))}
            <AddButton label="إضافة خدمة" onClick={() =>
              patch("services", [...content.services, { id: newId("sv"), icon: "sparkles", title: "خدمة جديدة", description: "" } as Service])
            } />
          </>
        )}

        {/* ===== العروض ===== */}
        {tab === "offers" && (
          <>
            {content.offers.map((of, i) => (
              <ItemCard key={of.id} onDelete={() => patch("offers", content.offers.filter((x) => x.id !== of.id))}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Toggle on={of.active} onChange={(v) => {
                    const arr = [...content.offers]; arr[i] = { ...of, active: v }; patch("offers", arr);
                  }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: of.active ? "var(--ok)" : "var(--ink-3)" }}>
                    {of.active ? "العرض ظاهر في الموقع" : "العرض مخفي"}
                  </span>
                </div>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <Field label="عنوان العرض">
                    <input className="input" value={of.title} onChange={(e) => {
                      const arr = [...content.offers]; arr[i] = { ...of, title: e.target.value }; patch("offers", arr);
                    }} />
                  </Field>
                  <Field label="شارة العرض (مثل: خصم ١٥٪)">
                    <input className="input" value={of.badge} onChange={(e) => {
                      const arr = [...content.offers]; arr[i] = { ...of, badge: e.target.value }; patch("offers", arr);
                    }} />
                  </Field>
                </div>
                <Field label="وصف العرض">
                  <textarea className="input" value={of.description} onChange={(e) => {
                    const arr = [...content.offers]; arr[i] = { ...of, description: e.target.value }; patch("offers", arr);
                  }} />
                </Field>
                <Field label="الأيقونة">
                  <IconPicker value={of.icon} onChange={(icon) => {
                    const arr = [...content.offers]; arr[i] = { ...of, icon }; patch("offers", arr);
                  }} />
                </Field>
              </ItemCard>
            ))}
            <AddButton label="إضافة عرض" onClick={() =>
              patch("offers", [...content.offers, { id: newId("of"), icon: "gift", title: "عرض جديد", description: "", badge: "", active: true } as Offer])
            } />
          </>
        )}

        {/* ===== الباقات ===== */}
        {tab === "packages" && (
          <>
            {content.packages.map((pk, i) => (
              <ItemCard key={pk.id} onDelete={() => patch("packages", content.packages.filter((x) => x.id !== pk.id))}>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                  <Field label="اسم الباقة">
                    <input className="input" value={pk.title} onChange={(e) => {
                      const arr = [...content.packages]; arr[i] = { ...pk, title: e.target.value }; patch("packages", arr);
                    }} />
                  </Field>
                  <Field label="السعر">
                    <input className="input" value={pk.price} onChange={(e) => {
                      const arr = [...content.packages]; arr[i] = { ...pk, price: e.target.value }; patch("packages", arr);
                    }} />
                  </Field>
                  <Field label="الوحدة (ريال / ريال سنويًا...)">
                    <input className="input" value={pk.unit} onChange={(e) => {
                      const arr = [...content.packages]; arr[i] = { ...pk, unit: e.target.value }; patch("packages", arr);
                    }} />
                  </Field>
                  <Field label="نسبة الخصم % (0 = بدون خصم)">
                    <input className="input" type="number" min={0} max={99} value={pk.discount ?? 0} onChange={(e) => {
                      const arr = [...content.packages]; arr[i] = { ...pk, discount: Math.max(0, Math.min(99, Number(e.target.value) || 0)) }; patch("packages", arr);
                    }} />
                  </Field>
                </div>
                <Field label="المزايا (كل ميزة في سطر)">
                  <textarea className="input" value={pk.features.join("\n")} onChange={(e) => {
                    const arr = [...content.packages];
                    arr[i] = { ...pk, features: e.target.value.split("\n").filter((f) => f.trim() !== "") };
                    patch("packages", arr);
                  }} />
                </Field>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <Toggle on={pk.featured} onChange={(v) => {
                    const arr = [...content.packages]; arr[i] = { ...pk, featured: v }; patch("packages", arr);
                  }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>باقة مميزة (بإطار متدرج)</span>
                  {pk.featured && (
                    <input className="input" style={{ maxWidth: 200 }} placeholder="نص الشارة" value={pk.badgeText} onChange={(e) => {
                      const arr = [...content.packages]; arr[i] = { ...pk, badgeText: e.target.value }; patch("packages", arr);
                    }} />
                  )}
                </div>
              </ItemCard>
            ))}
            <AddButton label="إضافة باقة" onClick={() =>
              patch("packages", [...content.packages, { id: newId("pk"), title: "باقة جديدة", price: "٠", unit: "ريال", features: [], featured: false, badgeText: "" } as Package])
            } />
          </>
        )}

        {/* ===== عملاؤنا ===== */}
        {tab === "clients" && (
          <>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
              يظهر الشركاء في شريط شعارات متحرك أنيق. أدخل اسم الشريك، وارفع شعاره من جهازك مباشرة (PNG أو SVG بخلفية شفافة يعطي أفضل نتيجة).
            </p>
            {content.clients.map((cl, i) => (
              <ItemCard key={cl.id} onDelete={() => patch("clients", content.clients.filter((x) => x.id !== cl.id))}>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <Field label="اسم العميل">
                    <input className="input" value={cl.name} onChange={(e) => {
                      const arr = [...content.clients]; arr[i] = { ...cl, name: e.target.value }; patch("clients", arr);
                    }} />
                  </Field>
                  <UploadInput label="شعار الشريك (يُرفع من جهازك)" value={cl.logo} onChange={(logo) => {
                    const arr = [...content.clients]; arr[i] = { ...cl, logo }; patch("clients", arr);
                  }} />
                </div>
              </ItemCard>
            ))}
            <AddButton label="إضافة عميل" onClick={() =>
              patch("clients", [...content.clients, { id: newId("cl"), name: "عميل جديد", logo: "" } as Client])
            } />
          </>
        )}

        {/* ===== الأعمال ===== */}
        {tab === "portfolio" && (
          <>
            {content.portfolio.map((pf, i) => (
              <ItemCard key={pf.id} onDelete={() => patch("portfolio", content.portfolio.filter((x) => x.id !== pf.id))}>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                  <Field label="اسم المشروع">
                    <input className="input" value={pf.title} onChange={(e) => {
                      const arr = [...content.portfolio]; arr[i] = { ...pf, title: e.target.value }; patch("portfolio", arr);
                    }} />
                  </Field>
                  <Field label="التصنيف">
                    <input className="input" value={pf.category} onChange={(e) => {
                      const arr = [...content.portfolio]; arr[i] = { ...pf, category: e.target.value }; patch("portfolio", arr);
                    }} />
                  </Field>
                  <Field label="رابط المشروع (اختياري)">
                    <input className="input" dir="ltr" placeholder="https://..." value={pf.url} onChange={(e) => {
                      const arr = [...content.portfolio]; arr[i] = { ...pf, url: e.target.value }; patch("portfolio", arr);
                    }} />
                  </Field>
                  <UploadInput label="صورة الغلاف (تُرفع من جهازك)" value={pf.image} onChange={(image) => {
                    const arr = [...content.portfolio]; arr[i] = { ...pf, image }; patch("portfolio", arr);
                  }} />
                </div>
              </ItemCard>
            ))}
            <AddButton label="إضافة عمل" onClick={() =>
              patch("portfolio", [...content.portfolio, { id: newId("pf"), title: "مشروع جديد", category: "", url: "", image: "" } as PortfolioItem])
            } />
          </>
        )}

        {/* ===== آراء العملاء ===== */}
        {tab === "testimonials" && (
          <>
            {content.testimonials.map((ts, i) => (
              <ItemCard key={ts.id} onDelete={() => patch("testimonials", content.testimonials.filter((x) => x.id !== ts.id))}>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                  <Field label="اسم العميل">
                    <input className="input" value={ts.name} onChange={(e) => {
                      const arr = [...content.testimonials]; arr[i] = { ...ts, name: e.target.value }; patch("testimonials", arr);
                    }} />
                  </Field>
                  <Field label="الصفة (صاحب مطعم...)">
                    <input className="input" value={ts.role} onChange={(e) => {
                      const arr = [...content.testimonials]; arr[i] = { ...ts, role: e.target.value }; patch("testimonials", arr);
                    }} />
                  </Field>
                  <Field label="التقييم (١–٥)">
                    <input className="input" type="number" min={1} max={5} value={ts.rating} onChange={(e) => {
                      const arr = [...content.testimonials]; arr[i] = { ...ts, rating: Number(e.target.value) || 5 }; patch("testimonials", arr);
                    }} />
                  </Field>
                </div>
                <Field label="نص الرأي">
                  <textarea className="input" value={ts.text} onChange={(e) => {
                    const arr = [...content.testimonials]; arr[i] = { ...ts, text: e.target.value }; patch("testimonials", arr);
                  }} />
                </Field>
              </ItemCard>
            ))}
            <AddButton label="إضافة رأي" onClick={() =>
              patch("testimonials", [...content.testimonials, { id: newId("ts"), name: "", role: "", text: "", rating: 5 } as Testimonial])
            } />
          </>
        )}

        {/* ===== الأسئلة الشائعة ===== */}
        {tab === "faq" && (
          <>
            {content.faq.map((fq, i) => (
              <ItemCard key={fq.id} onDelete={() => patch("faq", content.faq.filter((x) => x.id !== fq.id))}>
                <Field label="السؤال">
                  <input className="input" value={fq.q} onChange={(e) => {
                    const arr = [...content.faq]; arr[i] = { ...fq, q: e.target.value }; patch("faq", arr);
                  }} />
                </Field>
                <Field label="الإجابة">
                  <textarea className="input" value={fq.a} onChange={(e) => {
                    const arr = [...content.faq]; arr[i] = { ...fq, a: e.target.value }; patch("faq", arr);
                  }} />
                </Field>
              </ItemCard>
            ))}
            <AddButton label="إضافة سؤال" onClick={() =>
              patch("faq", [...content.faq, { id: newId("fq"), q: "", a: "" } as FaqItem])
            } />
          </>
        )}

        {/* ===== الإحصائيات ===== */}
        {tab === "stats" && (
          <>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
              تظهر الإحصائيات كأرقام بارزة أسفل الواجهة الرئيسية (مثل: +٢٥ مشروعًا منجزًا).
            </p>
            {content.stats.map((st, i) => (
              <ItemCard key={st.id} onDelete={() => patch("stats", content.stats.filter((x) => x.id !== st.id))}>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                  <Field label="القيمة (مثل: +٢٥)">
                    <input className="input" value={st.value} onChange={(e) => {
                      const arr = [...content.stats]; arr[i] = { ...st, value: e.target.value }; patch("stats", arr);
                    }} />
                  </Field>
                  <Field label="التسمية (مثل: مشروع منجز)">
                    <input className="input" value={st.label} onChange={(e) => {
                      const arr = [...content.stats]; arr[i] = { ...st, label: e.target.value }; patch("stats", arr);
                    }} />
                  </Field>
                </div>
              </ItemCard>
            ))}
            <AddButton label="إضافة إحصائية" onClick={() =>
              patch("stats", [...content.stats, { id: newId("st"), label: "", value: "" } as Stat])
            } />
          </>
        )}
      </div>

      {/* شريط الحفظ الثابت */}
      <div style={{ position: "fixed", bottom: 0, insetInlineStart: 0, insetInlineEnd: 0, display: "flex", justifyContent: "center", padding: 14, background: "linear-gradient(0deg, var(--ground) 60%, transparent)", zIndex: 40 }}>
        <button className="btn btn-grad" onClick={save} disabled={saving} style={{ minWidth: 220 }}>
          {saving ? "جارٍ الحفظ..." : "حفظ جميع التغييرات"}
        </button>
      </div>

      {/* إشعار الحفظ */}
      {toast && (
        <div style={{ position: "fixed", bottom: 84, insetInlineStart: "50%", transform: "translateX(50%)", background: "var(--surface-2)", color: toast.ok ? "var(--ok)" : "var(--danger)", border: `1px solid ${toast.ok ? "var(--ok)" : "var(--danger)"}`, padding: "10px 24px", borderRadius: 999, fontSize: 14, fontWeight: 600, zIndex: 70, boxShadow: "var(--shadow-soft)" }}>
          {toast.text}
        </div>
      )}
    </main>
  );
}
