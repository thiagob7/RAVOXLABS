import { ImageResponse } from "next/og";

export const alt = "Ravox Labs - Soluções Digitais para Pequenos Negócios";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const logoUrl = `${siteUrl}/assets/img/Logo.png`;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#080A0C",
        backgroundImage:
          "radial-gradient(circle at 20% 50%, rgba(100, 103, 242, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(100, 103, 242, 0.15) 0%, transparent 50%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <img
          src={logoUrl}
          alt="Ravox Labs Logo"
          width="200"
          height="200"
          style={{
            marginBottom: "20px",
          }}
        />
        <div
          style={{
            fontSize: 36,
            color: "#818898",
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          Soluções Digitais para Pequenos Negócios
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#6467F2",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Sites • Sistemas • Design UI/UX
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
