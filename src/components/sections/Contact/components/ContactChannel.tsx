import Link from "next/link";
import { ReactNode } from "react";

interface ContactChannelProps {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
}

export const ContactChannel = ({
  icon,
  label,
  value,
  href,
}: ContactChannelProps) => {
  return (
    <Link href={href} className="flex items-start gap-4 group">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
        <div className="text-blue-500">{icon}</div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <span className="text-base text-white group-hover:text-blue-500 transition-colors">
          {value}
        </span>
      </div>
    </Link>
  );
};
