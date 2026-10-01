import { env } from "~/@core/infra/constants/env";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ravox Labs",
    alternateName: ["Ravox", "RAVOXLABS"],
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
      "https://ui.ravoxlabs.com",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ravox Labs",
    url: env.BASE_URL,
    description:
      "Soluções digitais para pequenos negócios. Sites profissionais, sistemas personalizados e design UI/UX.",
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
