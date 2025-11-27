import { useState } from "react";
import { Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface HeaderProps {
  currentSection: "metrics" | "search" | "global";
  onSectionChange: (section: "metrics" | "search" | "global") => void;
  datasetId: string;
  onDatasetIdChange: (id: string) => void;
  onDatasetSubmit?: () => void;
}

export const Header = ({
  currentSection,
  onSectionChange,
  datasetId,
  onDatasetIdChange,
  onDatasetSubmit,
}: HeaderProps) => {
  // navigation removed

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Header Principal */}
        <div className="flex items-center justify-between py-4">
          {/* Logo y Brand (con input al lado) */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center gap-2 bg-gradient-to-br from-[#2962FF] to-[#1E4ED8] p-2.5 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="mr-4">
                <h1 className="text-xl font-bold text-black">
                DataCensus
              </h1>
                <p className="text-xs font-medium" style={{ color: '#000000' }}>MinTIC Analytics</p>
            </div>

            {currentSection === "metrics" && (
              <div className="flex-1 flex items-center gap-3">
                <label className="text-sm font-semibold text-black flex items-center">
                  Dataset ID:
                </label>
                <Input
                  placeholder="Ej: 8dbv-wsjq"
                  value={datasetId}
                  onChange={(e) => onDatasetIdChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSectionChange("metrics");
                      const el = document.getElementById("analytics-by-id");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                      onDatasetSubmit && onDatasetSubmit();
                    }
                  }}
                  className="flex-1 h-10 bg-[#FFFFFF] text-black placeholder-[#000000] border-2 border-white/30 rounded-lg focus:ring-4 focus:ring-white/20 transition-colors shadow-lg"
                />
                <p className="text-xs text-gray-800/80">
                  Encuentra IDs en <strong>datos.gov.co</strong>
                </p>
              </div>
            )}
            
          </div>
        </div>

        {/* Mobile menu removed */}
      </div>
    </header>
  );
};
