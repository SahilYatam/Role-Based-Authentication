import IconGradient from "../ui/IconGradient.jsx";
import { Shield } from 'lucide-react';

const DashboardHeader = ({ title, subtitle }) => {
  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <IconGradient 
            icon={Shield} 
            gradient="bg-gradient-to-br from-purple-500 to-pink-500" 
            size="md"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;