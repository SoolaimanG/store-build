import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LightingScene } from "./lighting-scene";
import { SquigglyUnderline } from "./squiggly-underline";
import { Text } from "./text";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import Marquee from "./ui/marquee";
import { templateShowCaseList } from "@/constants";
import { useState } from "react";
import { appConfig, errorMessageAndStatus } from "@/lib/utils";
import { useAuthentication } from "@/hooks/use-authentication";
import TemplateCard from "./template-card";
import { toast } from "@/hooks/use-toast";
import queryString from "query-string";
import { PATHS } from "@/types";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delay: 0.2,
    },
  },
};

export const LandingPageHeroSection = () => {
  const [prompt, setPrompt] = useState("");
  const { isAuthenticated } = useAuthentication();
  const n = useNavigate();

  const onGenerate = () => {
    try {
      if (!isAuthenticated) {
        const q = queryString.stringify({ useAi: true, prompt });
        n(PATHS.SIGNUP + `?${q}`);
        return;
      }

      const q = queryString.stringify({ useAi: true, prompt });

      n(PATHS.DASHBOARD + `?${q}`);
    } catch (error) {
      const { message } = errorMessageAndStatus(error);
      toast({
        title: "ERROR",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.main
      className="relative"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      <LightingScene size="large" side="left" />
      <div className="flex flex-col items-center gap-5 mt-10 w-full">
        <div className="flex items-center gap-3 border border-primary/50 cursor-pointer border-1 px-2 py-1 rounded-full">
          <Sparkles size={23} className="bg-primary p-1 rounded-full" />
          <Text className="text-gray-200">
            Discover the all new {appConfig.name}
          </Text>
        </div>
        <motion.h1
          className="md:text-5xl text-3xl text-center font-bold"
          variants={fadeInUp}
        >
          Start An Online Business In Just{" "}
          <SquigglyUnderline color="purple" className="text-primary">
            30 Seconds
          </SquigglyUnderline>{" "}
        </motion.h1>
        <motion.div variants={fadeInUp}>
          <Text className="text-gray-200 text-center md:max-w-5xl max-w-4xl m-auto">
            Launch your online store effortlessly with AI-powered guidance—no
            coding needed. Start building a standout ecommerce presence today!
          </Text>
        </motion.div>
        <motion.div
          className="flex w-full items-center justify-center lg:mx-0"
          variants={fadeInUp}
        >
          <div className="relative p-1 w-[85%] md:w-[45%]">
            <Input
              value={prompt!}
              onChange={(e) => setPrompt(e.target.value)}
              className="rounded-full h-[3rem] border-primary/80 bg-primary/5 w-full focus:ring-0 focus:border-hidden"
            />

            <Button
              size="sm"
              variant="shine"
              disabled={!prompt}
              onClick={onGenerate}
              className="rounded-full absolute right-2 top-2 mt-[0.1rem] gap-2"
            >
              <Sparkles size={17} />
              Generate
            </Button>
          </div>
        </motion.div>
        {/* Representation of store components */}
        <motion.div variants={fadeInUp}>
          <nav className="flex items-center justify-between">
            <motion.h2
              className="text-2xl font-semibold text-gray-200"
              variants={fadeInUp}
            >
              Templates Examples
            </motion.h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="linkHover2">
                <Link to="#" className="text-lg">
                  Explore All
                </Link>
              </Button>
            </motion.div>
          </nav>
          <div>
            <Marquee pauseOnHover className="mt-6">
              {templateShowCaseList.map((template, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={"#"}>
                    <TemplateCard {...template} />
                  </Link>
                </motion.div>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute z-30 inset-y-0 -left-10 md:-left-[10rem] w-1/3 bg-gradient-to-r from-white dark:from-background" />
            <div className="pointer-events-none absolute inset-y-0 -right-10 md:-right-[10rem] w-1/3 bg-gradient-to-l from-white dark:from-background" />
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};
