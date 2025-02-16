import { floatingIcons } from "@/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { FC, ReactNode } from "react";

const FloatingIcons: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <main
      className={cn("max-w-md mx-auto mt-20 text-center relative", className)}
    >
      {floatingIcons.map((icon, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.2, type: "spring" }}
          className={cn(
            "absolute p-2 bg-slate-900 rounded-full",
            icon.className
          )}
        >
          <span className="text-2xl">{icon.icon}</span>
        </motion.div>
      ))}

      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </main>
  );
};

export default FloatingIcons;
