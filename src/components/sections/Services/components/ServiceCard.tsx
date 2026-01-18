import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-850 border border-gray-600 hover:border-[#6467F2]/50 transition-all duration-300">
      <div className="text-blue-500 bg-blue-500/10 p-3 rounded-xl w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mt-6">{title}</h3>
      <span className="text-gray-400 leading-relaxed mt-2">{description}</span>
    </div>
  );
};
