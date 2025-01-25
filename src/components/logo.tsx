import { cn } from "@/lib/utils";
import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface LogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  path?: string;
  className?: string;
  url?: string;
  name?: string;
  animate?: boolean;
}

export const Logo: FC<LogoProps> = ({
  path = window.location.origin,
  className,
  name = "StoreBuild",
  animate = false,
  ...props
}) => {
  const variants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const MotionLink = motion(Link);

  return animate ? (
    <MotionLink
      {...props}
      to={path}
      className={cn(
        "text-2xl font-bold transition-colors hover:text-gray-700 dark:hover:text-gray-300",
        className
      )}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      transition={{ duration: 0.2 }}
    >
      {name}
    </MotionLink>
  ) : (
    <Link
      {...props}
      to={path}
      className={cn(
        "text-2xl font-bold transition-colors hover:text-gray-700 dark:hover:text-gray-300",
        className
      )}
    >
      {name}
    </Link>
  );
};

export default Logo;
