import { ReactNode } from "react";

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <div className="flex flex-col items-start text-start p-6 rounded-2xl bg-gray-900 border border-gray-600 hover:border-blue-500/50 transition-all duration-300">
      <div className="text-blue-500 bg-blue-500/10 p-3 rounded-xl w-12 h-12 flex items-start">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mt-6">{title}</h3>
      <span className="text-gray-400 leading-relaxed mt-2">{description}</span>
    </div>
  );
};
