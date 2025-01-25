import { Sparkles } from "lucide-react";
import { Logo } from "./logo";
import { Section } from "./section";
import { Button } from "./ui/button";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useStoreBuildState } from "@/store";
import { Text } from "./text";
import { formatAmountToNaira, isPathMatching } from "@/lib/utils";
import { PATHS } from "@/types";
import { AIChat } from "./ai-chat";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "react-router-dom";

const DashBoardNavBar = () => {
  const isDesktop = useMediaQuery("(min-width: 767px)");
  const { user } = useStoreBuildState();
  const { balance = 0 } = user || {};

  const balanceUI = (
    <Button variant="ghost" size="sm" className="flex-col items-start">
      <Text>Balance</Text>
      <h3>{formatAmountToNaira(balance)}</h3>
    </Button>
  );

  return (
    <Section className="flex items-center justify-between fixed bg-slate-900 py-3 top-0 left-0 right-0 z-50 transition-shadow duration-300 ease-in-out md:max-w-screen">
      <Logo path={location.href} />
      <div className="flex items-center md:gap-4 gap-2">
        <AIChat>
          <Button variant="shine" size="icon" className="rounded-full">
            <Sparkles size={18} />
          </Button>
        </AIChat>
        {isPathMatching(PATHS.STORE_FRONT) && (
          <Button asChild size="sm" variant="outline">
            <Link to={PATHS.STORE + user?.storeCode}>Preview</Link>
          </Button>
        )}
        {balanceUI}
      </div>
    </Section>
  );
};

export default DashBoardNavBar;
