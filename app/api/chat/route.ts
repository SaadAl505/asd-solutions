import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getContent, discountedPrice } from "@/lib/content";

export const dynamic = "force-dynamic";

const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 1000;

/** يبني معرفة المساعد من بيانات النظام الحية (لوحة التحكم) */
async function buildSystemPrompt(): Promise<string> {
  const c = await getContent();
  const s = c.settings;

  const services = c.services.map((sv) => `- ${sv.title}: ${sv.description}`).join("\n");
  const packages = c.packages
    .map((p) => {
      const final = discountedPrice(p.price, p.discount);
      const priceLine = final
        ? `السعر الأصلي ${p.price} ${p.unit} وبعد خصم ${p.discount}% يصبح ${final} ${p.unit}`
        : `${p.price} ${p.unit}`;
      return `- ${p.title}: ${priceLine} (${p.features.join("، ")})`;
    })
    .join("\n");
  const offers = c.offers
    .filter((o) => o.active)
    .map((o) => {
      const badge = o.badge ? ` (${o.badge})` : "";
      return `- ${o.title}${badge}: ${o.description}`;
    })
    .join("\n");
  const faq = c.faq.map((f) => `س: ${f.q}\nج: ${f.a}`).join("\n\n");

  const emailLine = s.email ? `- البريد الإلكتروني: ${s.email}` : "";
  const offersBlock = offers ? `## العروض الحالية\n${offers}\n` : "";

  return `أنت المساعد الذكي الرسمي لشركة "${s.siteName}" — ${s.tagline}.

مهمتك: الإجابة على استفسارات زوار الموقع حول خدمات الشركة وأسعارها وعروضها وآلية العمل، بدقة واختصار وبالعربية الفصحى.

## معلومات الشركة
- الوصف: ${s.description}
- النطاق الجغرافي: ${s.city}
- رقم الواتساب للتواصل والطلب: +${s.whatsapp}
${emailLine}

## الخدمات
${services}

## الباقات والأسعار
${packages}

${offersBlock}
## آلية العمل
1. يتواصل العميل عبر واتساب ويُتفق على الخدمات والمحتوى في اليوم نفسه.
2. يدفع العميل 50% مقدمًا عبر تحويل بنكي أو STC Pay، والمبلغ المتبقي عند الاستلام.
3. يستلم العميل مشروعه في موعده — الموقع خلال وقت قياسي، والتصاميم ملفات جاهزة للمطبعة.

## أسئلة شائعة
${faq}

## قواعدك
- أجب بالعربية الفصحى، بإيجاز ووضوح (2-4 جمل غالبًا)، ويمكنك استخدام نقاط عند تعداد الخدمات أو الأسعار.
- اعتمد فقط على المعلومات أعلاه. إذا سُئلت عن معلومة غير مذكورة (مثل موعد تسليم مخصص أو خصم خاص)، قل بلطف إن هذا يُتفق عليه مباشرة، ووجّه السائل للتواصل عبر واتساب: +${s.whatsapp}.
- إذا أبدى الزائر رغبة في الطلب أو الشراء، شجّعه ووجّهه لزر واتساب في الموقع.
- إذا خرج السؤال تمامًا عن نطاق خدمات الشركة، اعتذر بلطف ووضّح أنك مختص باستفسارات "${s.siteName}" فقط.
- لا تختلق أسعارًا أو خدمات أو مواعيد غير مذكورة.`;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      reply:
        "المساعد الذكي غير مفعّل حاليًا. يسعدنا خدمتك مباشرة عبر واتساب — اضغط زر التواصل في الموقع.",
    });
  }

  const body = (await request.json()) as {
    messages?: { role: string; content: string }[];
  };

  const history = (body.messages ?? [])
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim() !== ""
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (history.length === 0 || history.at(-1)?.role !== "user") {
    return NextResponse.json({ ok: false, error: "رسالة غير صالحة" }, { status: 400 });
  }

  const client = new Anthropic();

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        {
          type: "text",
          text: await buildSystemPrompt(),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: history,
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({
        reply: "عذرًا، لا يمكنني المساعدة في هذا الطلب. هل لديك استفسار عن خدماتنا؟",
      });
    }

    const reply = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({
      reply: reply || "عذرًا، لم أفهم سؤالك — هل يمكنك إعادة صياغته؟",
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({
        reply: "المساعد الذكي غير مفعّل حاليًا. يسعدنا خدمتك مباشرة عبر واتساب.",
      });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({
        reply: "الضغط مرتفع حاليًا، يرجى المحاولة بعد لحظات — أو تواصل معنا عبر واتساب.",
      });
    }
    console.error("chat api error:", error);
    return NextResponse.json({
      reply: "حدث خطأ مؤقت، يرجى المحاولة مرة أخرى — أو تواصل معنا عبر واتساب.",
    });
  }
}
