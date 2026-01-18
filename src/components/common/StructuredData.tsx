const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ravoxlabs.com";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ravox Labs",
    url: siteUrl,
    logo: `${siteUrl}/assets/img/Logo.png`,
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
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ravox Labs",
    url: siteUrl,
    description:
      "Soluções digitais para pequenos negócios. Sites profissionais, sistemas personalizados e design UI/UX.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
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
