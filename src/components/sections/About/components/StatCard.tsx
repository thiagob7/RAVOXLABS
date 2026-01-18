interface StatCardProps {
  number: string;
  title: string;
  className?: string;
}

export const StatCard = ({ number, title, className }: StatCardProps) => {
  return (
    <div
      className={`flex flex-col items-center text-center ${className || ""}`}
    >
      <span className="text-4xl  font-bold text-[#6467F2] mb-2">{number}</span>
      <span className="text-sm text-white">{title}</span>
    </div>
  );
};
