"use client";

import {
  Mail,
  Phone,
  Package,
  Video,
  UserRoundPlus,
  Landmark,
} from "lucide-react";
import AutoPlay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import {
  errorMessageAndStatus,
  generateRandomString,
  storeBuilder,
} from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useStoreBuildState } from "@/store";
import { useAuthentication } from "@/hooks/use-authentication";
import { Link } from "react-router-dom";
import { PATHS } from "@/types";
import AddPhoneNumber from "./add-phone-number";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import AddBankAccount from "./add-bank-account";

export function ProfileCompletionCarousel() {
  const { setOpenOTPValidator } = useStoreBuildState();
  const { user } = useAuthentication(undefined, 3000);
  const sendVerificationCode = async () => {
    try {
      const res = await storeBuilder.sendOTP("verify-email", user?.email!);
      setOpenOTPValidator({ otpFor: "verify-email", userEmail: user?.email! });
      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      console.log(error);
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "ERROR",
        description,
        variant: "destructive",
      });
    }
  };

  const { data: onboardingFlowsData, error: onboardingFlowsDataError } =
    useQuery({
      queryKey: ["onboardingFlows"],
      queryFn: () => storeBuilder.getOnboardingFlows(),
    });

  useToastError(onboardingFlowsDataError);

  const {
    isEmailVerified = true,
    phoneNumber = "true",
    hasProduct = true,
    tutorialVideoWatch = true,
    addPaymentMethod = true,
  } = onboardingFlowsData?.data || {};

  return (
    <div className={`relative w-full`}>
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Carousel
              opts={{ loop: true }}
              plugins={[
                AutoPlay({
                  delay: 6000,
                }),
              ]}
            >
              <CarouselContent>
                {!isEmailVerified && (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 basis-[85%]">
                    <Card className="w-full h-[12rem]">
                      <CardContent className="pt-2">
                        <div className="flex flex-col">
                          <div className="p-2 bg-primary/10 w-fit rounded-full">
                            <Mail size={23} className=" text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">
                            Verify Email
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Confirm your email address to secure your account.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end items-end py-0 mt-0">
                        <Button
                          variant="ringHover"
                          onClick={sendVerificationCode}
                        >
                          Resend Verification
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                )}
                {!phoneNumber && (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 basis-[85%]">
                    <Card className="w-full h-[12rem]">
                      <CardContent className="pt-2">
                        <div className="flex flex-col">
                          <div className="p-2 bg-primary/10 w-fit rounded-full">
                            <Phone size={23} className=" text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">
                            Add Phone Number
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Add a phone number for additional security and
                            notifications.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end items-end py-0 mt-0">
                        <AddPhoneNumber>
                          <Button variant="ringHover">Add phone number</Button>
                        </AddPhoneNumber>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                )}
                {!hasProduct && (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 basis-[85%]">
                    <Card className="w-full h-[12rem]">
                      <CardContent className="pt-2">
                        <div className="flex flex-col">
                          <div className="p-2 bg-primary/10 w-fit rounded-full">
                            <Package size={23} className=" text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">
                            Add Your First Product
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Start selling by adding your first product to your
                            store.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end items-end py-0 mt-0">
                        <Button
                          asChild
                          variant="ringHover"
                          //   disabled={steps[currentStep].completed}
                        >
                          <Link
                            to={
                              PATHS.STORE_PRODUCTS +
                              generateRandomString(13) +
                              "#new"
                            }
                          >
                            Add product
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                )}
                {!addPaymentMethod && (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 basis-[85%]">
                    <Card className="w-full h-[12rem]">
                      <CardContent className="pt-2">
                        <div className="flex flex-col">
                          <div className="p-2 bg-primary/10 w-fit rounded-full">
                            <Landmark size={23} className=" text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">
                            Add Payment Details
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Add your account detail to withdraw and recieve
                            money directly to your account.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end items-end py-0 mt-0">
                        <AddBankAccount>
                          <Button type="button" variant="ringHover">
                            Add Bank Account
                          </Button>
                        </AddBankAccount>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                )}
                {import.meta.env.VITE_IS_REFERRAL_ONGOING === "true" && (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 basis-[85%]">
                    <Card className="w-full h-[12rem]">
                      <CardContent className="pt-2">
                        <div className="flex flex-col">
                          <div className="p-2 bg-primary/10 w-fit rounded-full">
                            <UserRoundPlus
                              size={23}
                              className=" text-primary"
                            />
                          </div>
                          <h3 className="text-lg font-semibold">
                            Referral Users
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Refer users, earn N100 per signup! Share your link,
                            and get rewarded for every successful referral
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end items-end py-0 mt-0">
                        <Button asChild variant="ringHover">
                          <Link to={PATHS.STORE_REFERRALS}>View Referrals</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                )}
                {!tutorialVideoWatch && (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 basis-[85%]">
                    <Card className="w-full h-[12rem]">
                      <CardContent className="pt-2">
                        <div className="flex flex-col">
                          <div className="p-2 bg-primary/10 w-fit rounded-full">
                            <Video size={23} className=" text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">
                            Watch App Tutorial
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Watch a video on how to use and navigate the app,
                            also learn to use the AI.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end items-end py-0 mt-0">
                        <Button
                          asChild
                          variant="ringHover"
                          //   disabled={steps[currentStep].completed}
                        >
                          <Link to={PATHS.STORE_TUTORIAL}>Watch Video</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
