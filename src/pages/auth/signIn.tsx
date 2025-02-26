import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { ISignUp, PATHS } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FloatingIcons from "@/components/floating-icons";
import { EnterEmail } from "@/components/enter-email";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useStoreBuildState } from "@/store";
import { useAuthentication } from "@/hooks/use-authentication";
import queryString from "query-string";

const SignIn = () => {
  const { setOpenOTPValidator } = useStoreBuildState();
  const { user } = useAuthentication();
  const n = useNavigate();

  const handleSignIn = async (data: Partial<ISignUp>) => {
    try {
      if (user?.email === data.email) {
        toast({
          title: "LOGIN",
          description: "You are already logged in, Thank you",
        });
        return;
      }

      await storeBuilder.sendOTP("login", data.email!);

      const { redirectTo } = queryString.parse(location.search) as {
        redirectTo?: string;
      };

      setOpenOTPValidator({
        open: true,
        userEmail: data.email,
        header: "Verify it's you!",
        otpFor: "login",
        onSuccess: () => {
          if (user?.plan.type === "free") {
            n(PATHS.SUBSCRIBE);
            window.location.reload();
            return;
          } else {
            window.location.href = redirectTo || PATHS.DASHBOARD;
          }
        },
      });
    } catch (error) {
      console.log(error);
      const _error = errorMessageAndStatus(error);
      toast({
        title: _error.status || "ERROR",
        description: _error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen p-4">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center max-w-6xl mx-auto py-4"
      >
        <Logo />
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link to={PATHS.SIGNUP}>Sign Up</Link>
        </Button>
      </motion.header>
      <FloatingIcons>
        <EnterEmail
          onNext={handleSignIn}
          data={{ email: "" }}
          header="Welcome Back!"
          showFooter={false}
          btnLabel="Sign In"
        />
      </FloatingIcons>
    </main>
  );
};

export default SignIn;
