import { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, CornerDownLeft } from "lucide-react";
import qs from "query-string";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Logo } from "@/components/logo";
import { Text } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  addQueryParameter,
  cn,
  errorMessageAndStatus,
  storeBuilder,
} from "@/lib/utils";
import { ISignUp, IStepProps, PATHS } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import {
  buttonAnimation,
  buttonVariants,
  containerVariants,
  formAnimation,
  fullNameSchema,
  itemVariants,
  pageTransition,
  pageVariants,
  productTypeSchema,
  storeNameSchema,
} from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreBuildState } from "@/store";
import queryString from "query-string";
import { toast } from "@/hooks/use-toast";
import { useAuthentication } from "@/hooks/use-authentication";
import OpenSubscribeWindowBtn from "@/components/open-subscribe-window-btn";
import { EnterEmail } from "@/components/enter-email";
import FloatingIcons from "@/components/floating-icons";

const ProductTypeLoader = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {[...Array(20)].map((_, idx) => (
        <Skeleton
          key={idx}
          className="w-[6.5rem] h-10 rounded-none bg-slate-800 anima"
        />
      ))}
    </div>
  );
};

const EnterStoreName: FC<IStepProps> = ({ onNext, onBack, data }) => {
  const form = useForm<z.infer<typeof storeNameSchema>>({
    resolver: zodResolver(storeNameSchema),
    defaultValues: {
      storeName: data.storeName,
    },
  });

  function onSubmit(values: z.infer<typeof storeNameSchema>) {
    onNext(values);
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-3"
    >
      <header className="items-start justify-start w-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="link" onClick={onBack} className="px-0">
            <ChevronLeft />
            Back
          </Button>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-semibold"
        >
          Store Name
        </motion.h1>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div {...formAnimation}>
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="type here"
                      {...field}
                      className="w-full py-6 px-4 text-4xl md:text-4xl border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 caret-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div
            {...buttonAnimation}
            className="flex items-center w-full justify-center gap-3"
          >
            <Button
              type="submit"
              variant="ringHover"
              className="rounded-full h-[3rem] w-[9rem]"
            >
              Next
            </Button>
            <div className="flex items-center gap-1 font-medium">
              <CornerDownLeft size={17} />
              <Text>Or Press Enter</Text>
            </div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

const EnterFullName: FC<IStepProps> = ({ onNext, onBack, data }) => {
  const form = useForm<z.infer<typeof fullNameSchema>>({
    resolver: zodResolver(fullNameSchema),
    defaultValues: {
      fullName: data.fullName,
    },
  });

  function onSubmit(values: z.infer<typeof fullNameSchema>) {
    onNext(values);
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-3"
    >
      <header className="items-start justify-start w-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="link" onClick={onBack} className="px-0">
            <ChevronLeft />
            Back
          </Button>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-semibold"
        >
          Full Name
        </motion.h1>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div {...formAnimation}>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="type here"
                      {...field}
                      className="w-full py-6 px-4 text-4xl md:text-4xl border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 caret-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div
            {...buttonAnimation}
            className="flex items-center w-full justify-center gap-3"
          >
            <Button
              type="submit"
              variant="ringHover"
              className="rounded-full h-[3rem] w-[9rem]"
            >
              Next
            </Button>
            <div className="flex items-center gap-1 font-medium">
              <CornerDownLeft size={17} />
              <Text>Or Press Enter</Text>
            </div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

const SelectProductYouSell: FC<IStepProps> = ({ onBack, onNext, data }) => {
  const { setOpenOTPValidator } = useStoreBuildState();
  const {
    data: productTypes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-types"],
    queryFn: () => storeBuilder.getProductTypes(),
  });

  useToastError(error);

  const form = useForm<z.infer<typeof productTypeSchema>>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      productType: data.productType,
    },
  });

  async function onSubmit(values: z.infer<typeof productTypeSchema>) {
    try {
      const payload = { ...data, ...values };

      const res = await storeBuilder.signUp(
        payload.email!,
        payload.storeName!,
        payload.productType,
        payload.fullName!
      );
      console.log(res.data);
      onNext(values);
      setOpenOTPValidator({
        open: true,
        header: "Verify Email",
        desc: "An account has been created for you but first verify your account to continue.",
        otpFor: "verify-email",
        userEmail: payload.email,
      });
    } catch (error) {
      const _error = errorMessageAndStatus(error);
      toast({
        title: _error.status,
        description: _error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-3"
    >
      <header className="items-start justify-start w-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="link" onClick={onBack} className="px-0">
            <ChevronLeft />
            Back
          </Button>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-semibold text-left"
        >
          What Type Of Product Do You Sell?
        </motion.h1>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div {...formAnimation}>
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {isLoading ? (
                      <ProductTypeLoader />
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {productTypes?.data?.map((productType, index) => (
                          <motion.div
                            key={productType._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div
                              onClick={() => field.onChange(productType._id)}
                              className={cn(
                                "flex items-center gap-2 border-2 px-2 py-1 transition-colors ease-linear cursor-pointer",
                                field.value === productType._id
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "hover:bg-primary/10"
                              )}
                            >
                              {productType.icon}
                              <Text>{productType.name}</Text>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div
            {...buttonAnimation}
            className="flex items-center w-full justify-center gap-3"
          >
            <Button
              type="submit"
              variant="ringHover"
              disabled={form.formState.isSubmitting}
              className="rounded-full h-[3rem] w-[9rem]"
            >
              Sign Up
            </Button>
            <div className="flex items-center gap-1 font-medium mt-5">
              <CornerDownLeft size={17} />
              <Text>Or Press Enter</Text>
            </div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

const AccountCreated: FC<IStepProps> = ({ data }) => {
  const location = useLocation();
  const { user } = useAuthentication(undefined, 3000);
  const { setOpenOTPValidator } = useStoreBuildState();

  const qs = queryString.parse(location.search) as {
    subscribe: "";
    useAi: string;
  };

  const goto = qs.useAi ? "" : PATHS.DASHBOARD;
  const label = qs.useAi ? "Use Ai" : "Go to dashboard";

  useEffect;

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.span
        className="text-5xl p-2 rounded-full"
        variants={itemVariants}
      >
        🎉
      </motion.span>
      <motion.h2 className="text-3xl font-bold" variants={itemVariants}>
        Great, Your account has been created successfully.
      </motion.h2>
      <motion.div variants={itemVariants}>
        <Text className="tracking-tight">
          Your account has been successfully created! Welcome aboard. You can
          now explore all features, manage your settings, and start building
          your online presence. We're excited to have you with us!
        </Text>
      </motion.div>
      <motion.div
        className="flex items-center gap-2 justify-center mt-5"
        variants={itemVariants}
      >
        {!user?.isEmailVerified && (
          <motion.div
            variants={buttonVariants()}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ringHover"
              className="rounded-full h-[3rem] px-9"
              onClick={() => {
                setOpenOTPValidator({
                  open: true,
                  otpFor: "verify-email",
                  userEmail: data.email,
                  header: "Account Created",
                  desc: "Please verify your account to continue your journey.",
                });
              }}
            >
              Verify Email
            </Button>
          </motion.div>
        )}
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant={user?.isEmailVerified ? "ringHover" : "ghost"}
            asChild
            className="hover:bg-slate-800 rounded-full h-[3rem] px-9 hover:text-white transition-colors duration-300"
          >
            <Link to={goto}>{label}</Link>
          </Button>
        </motion.div>

        {user?.isEmailVerified && (
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <OpenSubscribeWindowBtn>
              <Button
                variant={"destructive"}
                className=" rounded-full h-[3rem] px-9 hover:text-white transition-colors duration-300"
              >
                Subscribe Now
              </Button>
            </OpenSubscribeWindowBtn>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function SignUp() {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<ISignUp>({
    email: "",
    storeName: "",
    productType: "",
    fullName: "",
  });
  const location = useLocation();
  const n = useNavigate();

  const steps = [
    (props: IStepProps) => <EnterEmail {...props} />,
    (props: IStepProps) => <EnterStoreName {...props} />,
    (props: IStepProps) => <EnterFullName {...props} />,
    (props: IStepProps) => <SelectProductYouSell {...props} />,
    (props: IStepProps) => <AccountCreated {...props} />,
  ];

  const handleNext = async (newData: Partial<ISignUp>) => {
    try {
      const checkFor = currentPage === 0 ? "email" : "storeName";

      const {
        data: { isExisting },
      } = await storeBuilder.doesEmailOrStoreExist(
        newData.email,
        newData.storeName,
        checkFor
      );

      if (isExisting) {
        toast({
          title: "DUPLICATE",
          description: `This ${checkFor} you use is already in our database, Please login.`,
          variant: "destructive",
        });
        return;
      }

      const nextPage = currentPage + 1;
      const updatedData = { ...data, ...newData };
      if (nextPage < steps.length) {
        setCurrentPage(nextPage);
        setData(updatedData);
        const key = Object.keys(newData)[0] as keyof ISignUp;
        n(`?${addQueryParameter(key, updatedData[key])}`);
      }
    } catch (error) {
      const _error = errorMessageAndStatus(error);
      toast({
        title: _error.status,
        description: _error.message,
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 0) {
      setCurrentPage(prevPage);
      const key = Object.keys(data)[prevPage] as keyof ISignUp;
      const newQuery = qs.stringify({
        ...qs.parse(location.search),
        [key]: undefined,
      });
      n(`?${newQuery}`, { replace: true });
    }
  };

  useEffect(() => {
    const query = qs.parse(location.search) as ISignUp;
    setData((prev) => ({ ...prev, ...query }));

    if (!query.email) {
      setCurrentPage(0);
    } else if (!query.storeName) {
      setCurrentPage(1);
    } else if (!query.fullName) {
      setCurrentPage(2);
    } else if (!query.productType) {
      setCurrentPage(3);
    } else {
      setCurrentPage(4);
    }
  }, [location.search]);

  const CurrentStep = steps[currentPage];

  return (
    <div className="min-h-screen p-4">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center max-w-6xl mx-auto py-4"
      >
        <Logo />
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link to={PATHS.SIGNIN}>Sign In</Link>
        </Button>
      </motion.header>

      <FloatingIcons className="mt-[8rem] md:mt-[6rem]">
        <CurrentStep
          key={currentPage}
          onNext={handleNext}
          onBack={handleBack}
          data={data}
        />
      </FloatingIcons>
    </div>
  );
}
