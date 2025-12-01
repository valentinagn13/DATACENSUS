import { motion } from "framer-motion";
import { SearchAgentSection } from "@/components/SearchAgent/SearchAgentSection";

export const SearchSection = () => {
  return (
    <motion.div
      key="search-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 top-[72px] z-40 flex items-center justify-center p-4 md:p-6"
    >
      <SearchAgentSection />
    </motion.div>
  );
};
