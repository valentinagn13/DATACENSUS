import { motion } from "framer-motion";
import { GlobalMetricsSection } from "@/components/Metrics/GlobalMetricsSection";

export const GlobalSection = () => {
  return (
    <motion.div
      key="global-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <GlobalMetricsSection />
    </motion.div>
  );
};
