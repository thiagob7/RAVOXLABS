import { env } from "~/@core/infra/constants/env";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${env.BASE_URL}/sitemap.xml`,
    host: env.BASE_URL,
  };
}
