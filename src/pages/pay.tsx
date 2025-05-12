import Logo from "@/components/logo";
import PaymentOptions from "@/store/payment-option";
import queryString from "query-string";
import { useParams } from "react-router-dom";

const Pay = () => {
  const { id = "" } = useParams() as { id: string };
  const qs = queryString.parse(location.search) as {
    phoneNumber?: string;
    storeCode?: string;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-900">
      <header className="w-full fixed top-0 bg-slate-950 p-5">
        <Logo />
      </header>
      <div className="w-full md:max-w-lg flex flex-col gap-4 items-center max-w-[90%]">
        <div className="w-full">
          <PaymentOptions
            orderId={id}
            disabledOptions={["share", "mono"]}
            phoneNumber={qs.phoneNumber}
            showName
            paymentFor="order"
            storeCode={qs.storeCode}
          />
        </div>
      </div>
    </div>
  );
};

export default Pay;
