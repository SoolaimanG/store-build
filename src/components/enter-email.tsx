import {
  buttonAnimation,
  emailSchema,
  formAnimation,
  pageTransition,
  pageVariants,
} from "@/constants";
import { IStepProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Text } from "./text";

export const EnterEmail: FC<
  IStepProps & { header?: string; showFooter?: boolean; btnLabel?: string }
> = ({
  onNext,
  data,
  header = "Get started with your email",
  showFooter = true,
  btnLabel = "Get Started",
}) => {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: data.email,
    },
  });

  function onSubmit(values: z.infer<typeof emailSchema>) {
    onNext(values);
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-semibold"
      >
        {header}
      </motion.h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div {...formAnimation}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="type your email"
                      {...field}
                      className="w-full py-6 px-4 text-4xl md:text-4xl border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 caret-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div {...buttonAnimation}>
            <Button
              type="submit"
              variant="ringHover"
              className="rounded-full h-[3rem] w-[9rem]"
            >
              {btnLabel}
            </Button>
          </motion.div>
        </form>
      </Form>
      {showFooter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Text className="text-xs text-gray-500 mt-4">
            By checking this box, I acknowledge and agree to the terms of use on
            behalf of the Company specified above
          </Text>
        </motion.div>
      )}
    </motion.div>
  );
};
