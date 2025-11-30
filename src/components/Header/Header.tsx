import { BarChart3, Search, TrendingUp, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  currentSection: "metrics" | "search" | "global" | "about";
  onSectionChange: (section: "metrics" | "search" | "global" | "about") => void;
<<<<<<< HEAD
=======
  isEmbedded?: boolean;
>>>>>>> 7f9ab95 (feat: Enhance Header and SearchAgentSection with new "About" functionality and improved user experience)
}

export const Header = ({
  currentSection,
  onSectionChange,
  isEmbedded = false,
}: HeaderProps) => {
  const navItems = [
    { id: "metrics" as const, label: "Análisis por ID", icon: BarChart3 },
    { id: "search" as const, label: "Agente de IA", icon: Search },
    { id: "global" as const, label: "Métricas Generales", icon: TrendingUp },
  ];
  const visibleNav = isEmbedded ? navItems.filter(i => i.id === 'metrics') : navItems;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Espaciador izquierdo */}
          <div className="w-12"></div>
          
          {/* Navegación Centrada - Minimalista */}
          <nav className="flex items-center gap-8">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className="relative px-4 py-3 font-medium text-sm transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" 
                      : "bg-white/50 text-gray-600 group-hover:bg-white group-hover:text-gray-900 group-hover:shadow-md"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`font-semibold transition-colors ${
                    isActive 
                      ? "text-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent" 
                      : "text-gray-600 group-hover:text-gray-900"
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Línea inferior solo en activo */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* About Button - Right Corner */}
          <button
            onClick={() => onSectionChange("about")}
            className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
              currentSection === "about"
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                : "bg-white/50 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md"
            }`}
            title="Sobre este sitio web"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
