import { env } from "~/@core/infra/constants/env";

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
      url: env.BASE_URL,
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
