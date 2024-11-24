import { appConfig, storeBuilder } from "@/lib/utils";
import { FC } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { FlutterwaveConfig } from "flutterwave-react-v3/dist/types";
import { ICompletePaymentDetails } from "@/types";

const CompletePaymentBtn: FC<ICompletePaymentDetails> = ({
  children,
  title = appConfig.name,
  description,
  amount,
  meta = { type: "subscription" },
  customer,
  onError = () => {},
  onSuccess = () => {},
}) => {
  const flwConfig: FlutterwaveConfig = {
    public_key: import.meta.env.VITE_FLW_PUBK,
    tx_ref: Date.now() + "",
    amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer,
    customizations: {
      title,
      description: description || "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
    meta,
  };

  const handlePayment = useFlutterwave(flwConfig);

  const _handlePayment = () => {
    handlePayment({
      async callback(data) {
        try {
          if (meta.type === "subscription") {
            await storeBuilder.verifySubscription(data.tx_ref);
          }

          if (meta.type === "product") {
            // Product payment process
          }
          onSuccess();
        } catch (error) {
          onError();
        } finally {
          closePaymentModal();
        }
      },
      onClose: () => {},
    });
  };

  return <div onClick={_handlePayment}>{children}</div>;
};

export default CompletePaymentBtn;
