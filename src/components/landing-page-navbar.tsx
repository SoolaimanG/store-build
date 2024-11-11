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
import { NewsLetterButton } from "./news-letter-btn";

const MobileNavBar = () => {
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
        <SheetFooter className="mt-auto mb-8 flex-row items-stretch justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Link to="/signin" className="flex items-center gap-2">
              Sign In
            </Link>
          </motion.div>
          <SeparatorHorizontal />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Link to="/signup" className="flex items-center gap-2">
              Sign Up
            </Link>
          </motion.div>
        </SheetFooter>
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
        <NewsLetterButton showModal>
          {" "}
          <Button variant="outline">Let's do it</Button>
        </NewsLetterButton>
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
