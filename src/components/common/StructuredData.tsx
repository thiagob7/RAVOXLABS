import { env } from "~/@core/infra/constants/env";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ravox Labs",
    url: env.BASE_URL,
    logo: `${env.BASE_URL}/assets/img/Logo.png`,
    description:
      "Ravox Labs desenvolve soluções digitais rápidas, modernas e acessíveis para pequenos negócios.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+5571992446022",
      contactType: "customer service",
      email: "contato@ravoxlabs.com",
      areaServed: "BR",
      availableLanguage: ["Portuguese"],
    },
    sameAs: [
      "https://www.instagram.com/ravoxlabs/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ravox Labs",
    url: env.BASE_URL,
    description:
      "Soluções digitais para pequenos negócios. Sites profissionais, sistemas personalizados e design UI/UX.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${env.BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
