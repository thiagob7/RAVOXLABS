import { env } from "~/@core/infra/constants/env";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [`${env.BASE_URL}/assets/img/Logo.png`],
    },
  ];
}
