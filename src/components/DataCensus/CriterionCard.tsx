import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface CriterionCardProps {
  title: string;
  value: number | undefined; // Cambiado para aceptar undefined
  description: string;
  tooltipContent: string;
  color?: "green" | "yellow" | "red" | "blue" | "purple" | "teal" | "orange" | "indigo" | "rose";
  extra?: React.ReactNode;
  delay?: number;
}

const colorMap = {
  green: "from-green-500/10 to-green-600/10 border-green-200",
  yellow: "from-yellow-500/10 to-yellow-600/10 border-yellow-200", 
  red: "from-red-500/10 to-red-600/10 border-red-200",
  blue: "from-blue-500/10 to-blue-600/10 border-blue-200",
  purple: "from-purple-500/10 to-purple-600/10 border-purple-200",
  teal: "from-teal-500/10 to-teal-600/10 border-teal-200",
  orange: "from-orange-500/10 to-orange-600/10 border-orange-200",
  indigo: "from-indigo-500/10 to-indigo-600/10 border-indigo-200",
  rose: "from-rose-500/10 to-rose-600/10 border-rose-200"
};

const badgeColorMap = {
  green: "bg-green-100 text-green-800 hover:bg-green-200",
  yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  red: "bg-red-100 text-red-800 hover:bg-red-200",
  blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  teal: "bg-teal-100 text-teal-800 hover:bg-teal-200",
  orange: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  rose: "bg-rose-100 text-rose-800 hover:bg-rose-200"
};

export const CriterionCard = ({
  title,
  value,
  description,
  tooltipContent,
  color,
  extra,
  delay = 0
}: CriterionCardProps) => {
  // Manejar valores undefined o null
  const displayValue = value ?? 0; // Si es undefined o null, usar 0
  const displayText = typeof displayValue === 'number' ? displayValue.toFixed(1) : '0.0';

  // Determinar el color basado en el valor
  const getScoreColor = (score: number) => {
    if (score >= 8) return "green";
    if (score >= 6) return "yellow";
    if (score >= 4) return "blue";
    return "red";
  };

  const scoreColor = getScoreColor(displayValue);
  const currentColor = color || scoreColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={`bg-gradient-to-br ${colorMap[currentColor]} border backdrop-blur-sm h-full flex flex-col min-h-[200px]`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground">
            {title}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={badgeColorMap[currentColor]}>
              {displayText}/10
            </Badge>
            <div className="text-2xl font-bold text-foreground">
              {displayText}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
            {description}
          </p>
          {extra && (
            <div className="text-sm text-gray-500 mt-2">{extra}</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};