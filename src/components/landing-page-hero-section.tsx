import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LightingScene } from "./lighting-scene";
import { SquigglyUnderline } from "./squiggly-underline";
import { Text } from "./text";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import Marquee from "./ui/marquee";
import { templateShowCaseList } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { NewsLetterButton } from "./news-letter-btn";

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
  return (
    <motion.main
      className="relative"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      <LightingScene size="large" side="left" />
      <div className="flex flex-col gap-5 mt-10 w-full">
        <motion.h1
          className="text-5xl text-center font-bold"
          variants={fadeInUp}
        >
          Start An Online Business In Just{" "}
          <SquigglyUnderline color="purple" className="text-primary">
            30 Seconds
          </SquigglyUnderline>{" "}
        </motion.h1>
        <motion.div variants={fadeInUp}>
          <Text className="text-gray-200 text-center max-w-5xl">
            Launch your online store effortlessly with AI-powered guidance—no
            coding needed. Start building a standout ecommerce presence today!
          </Text>
        </motion.div>
        <motion.div
          className="flex w-full items-center justify-center lg:mx-0"
          variants={fadeInUp}
        >
          <div className="relative p-1 w-[70%]">
            <Input className="rounded-full h-[3rem] border-primary/80 bg-primary/5 w-full focus:ring-0 focus:border-hidden" />

            <NewsLetterButton>
              <Button
                size="sm"
                variant="shine"
                className="rounded-full absolute right-2 top-2 mt-[0.1rem] gap-2"
              >
                <Sparkles size={17} />
                Generate
              </Button>
            </NewsLetterButton>
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
          <Marquee pauseOnHover className="mt-6">
            {templateShowCaseList.map((template, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={"#"}
                  className="w-[35rem] h-fit block p-7 bg-slate-800 rounded-xl"
                >
                  <Avatar className="rounded-md w-full h-[23rem]">
                    <AvatarImage
                      src={template.image}
                      alt={template.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-md">
                      {template.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2">
                    <h3 className="text-xl font-semibold">{template.name}</h3>
                    <Text className="line-clamp-1 text-gray-400">
                      {template.descriptions}
                    </Text>
                  </div>
                </Link>
              </motion.div>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </motion.main>
  );
};
