import type { Metadata } from "next";
import HomePage from "@/components/home-page";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent("en");
  const title = `${settings.siteName} — ${settings.tagline}`;
  return {
    title,
    description: settings.description,
    openGraph: {
      title,
      description: settings.description,
      type: "website",
      locale: "en_US",
    },
  };
}

export default function EnglishPage() {
  return <HomePage lang="en" />;
}
