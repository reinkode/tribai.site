import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serviceSlugs, getService } from "@/lib/content";
import ServiceDetail from "@/components/ServiceDetail";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title.en} | TribAI LLC`,
    description: service.desc.en,
    alternates: {
      canonical: `https://tribai.site/services/${slug}`,
      languages: {
        en: `https://tribai.site/services/${slug}`,
        es: `https://tribai.site/services/${slug}`,
      },
    },
    openGraph: {
      title: `${service.title.en} | TribAI LLC`,
      description: service.desc.en,
      locale: "en_US",
      alternateLocale: "es_ES",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getService(slug)) notFound();

  return <ServiceDetail slug={slug} />;
}
