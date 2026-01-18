const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ravoxlabs.com";

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceUrl: string;
  provider: string;
}

export function ServiceSchema({
  name,
  description,
  serviceUrl,
  provider,
}: ServiceSchemaProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: serviceUrl,
      availableLanguage: ["Portuguese"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}
