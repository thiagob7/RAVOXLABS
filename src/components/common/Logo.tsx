import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "image" | "text";
  href?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const Logo = ({
  variant = "image",
  href = "/",
  width = 100,
  height = 100,
  className = "",
}: LogoProps) => {
  const logoContent =
    variant === "image" ? (
      <Image
        src="/assets/img/Logo.png"
        alt="Ravox Labs Logo"
        width={width}
        height={height}
        className={className}
        priority
        quality={90}
        sizes="(max-width: 768px) 100px, 150px"
      />
    ) : (
      <span className={`text-lg font-bold text-white uppercase ${className}`}>
        RAVOXLABS
      </span>
    );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return <>{logoContent}</>;
};
