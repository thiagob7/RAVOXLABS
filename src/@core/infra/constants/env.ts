export const env = {
  BASE_URL: String(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://ravoxlabs.com',
  ),
  API_BASE_URL: String(
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  ),
  PROJECT_NAME: String(process.env.NEXT_PUBLIC_PROJECT_NAME || 'RAVOXLABS'),
};

export type Env = Readonly<typeof env>;
