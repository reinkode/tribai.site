import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/live"],
    },
    sitemap: "https://tribai.site/sitemap.xml",
  };
}
