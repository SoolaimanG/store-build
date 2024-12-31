import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { landingPageNavBarLinks } from "@/constants";
import { Section } from "./section";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu, SeparatorHorizontal } from "lucide-react";
import { Logo } from "./logo";
import { PATHS } from "@/types";
import { useAuthentication } from "@/hooks/use-authentication";
import { storeBuilder } from "@/lib/utils";

const MobileNavBar = () => {
  const { isAuthenticated } = useAuthentication();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ringHover"
          className="rounded-full w-10 h-10"
        >
          <Menu size={20} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Logo />
            </motion.div>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col items-center justify-center gap-10 mt-8">
          {landingPageNavBarLinks.map((link, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Link
                to={link.path}
                className="text-4xl font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </nav>
        {!isAuthenticated && (
          <SheetFooter className="mt-auto mb-8 flex-row items-stretch justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Link to={PATHS.SIGNIN} className="flex items-center gap-2">
                Sign In
              </Link>
            </motion.div>
            <SeparatorHorizontal />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Link to={PATHS.SIGNUP} className="flex items-center gap-2">
                Sign Up
              </Link>
            </motion.div>
          </SheetFooter>
        )}
        {isAuthenticated && (
          <SheetFooter className="mt-auto mb-8 flex-row cursor-pointer hover:text-primary items-stretch justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              onClick={() => storeBuilder.signOut()}
            >
              Sign Out
            </motion.div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export const LandingPageNavBar: FC = () => {
  const isMobile = useMediaQuery("(max-width:767px)");

  return (
    <Section className="flex items-center justify-between">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-16"
      >
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          {landingPageNavBarLinks.map((link, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
            >
              <Link
                to={link.path}
                className="text-gray-200 hover:text-primary/65 hover:font-semibold transition-colors"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center gap-2"
      >
        {" "}
        <Button asChild variant="outline" className="rounded-full">
          <Link to={PATHS.SIGNUP}>Let's do it</Link>
        </Button>
        <AnimatePresence>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <MobileNavBar />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
};
