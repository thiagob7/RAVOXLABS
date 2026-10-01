import { env } from "~/@core/infra/constants/env";
import { MetadataRoute } from "next";

/* /about, /contact, /services e as 3 páginas de serviço hoje só redirecionam
   para seções da home; entram aqui quando virarem páginas de verdade. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [`${env.BASE_URL}/assets/img/Logo.png`],
    },
    {
      url: `${env.BASE_URL}/projetos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
