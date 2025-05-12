"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PaymentStatusBadge } from "./payment-status-badge";
import Logo from "./logo";
import { Text } from "./text";
import { Invoice, IOrderStatus } from "@/types";
import { getOrderProductCount } from "@/lib/utils";

export default function InvoiceDetails({
  companyName,
  companyAddress,
  companyPhone,
  orderNumber,
  invoiceId,
  dateIssued,
  dateDue,
  customerName,
  customerPhone,
  bankName = "NOT SPECIFIED",
  accountNumber = "NOT SPECIFIED",
  accountName = "NOT SPECIFIED",
  status,
  items,
  ...props
}: Partial<Invoice>) {
  const totalAmount = items?.reduce(
    (sum, item) => sum + (item.discount || item.price.default),
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("NGN", "NGN ");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 pb-20 md:pb-0 bg-slate-800">
      <Card className="border-0 shadow-none print:shadow-none rounded-none pb-5">
        <CardContent className="p-0 rounded-none">
          {/* Header with pattern */}
          <div className="bg-primary h-8 w-full rounded-t-none print:h-6"></div>

          {/* Invoice header */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Company info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Logo name={companyName} />
                </div>
              </div>

              {/* Invoice title and company address */}
              <div className="flex flex-col items-end text-right">
                <h1 className="text-2xl font-bold mb-2">INVOICE</h1>
                <Text>{companyAddress}</Text>
                <Text>{companyPhone}</Text>
              </div>
            </div>
          </div>

          {/* Order info */}
          <div className="px-6 md:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="text-sm font-medium mb-2">Payment for Order</h3>
                <p className="text-2xl font-bold truncate">{orderNumber}</p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-sm text-gray-600 font-semibold">
                  INVOICE TO
                </p>
                <p className="font-semibold text-sm">{customerName}</p>
                <Text>{customerPhone}</Text>
              </div>
            </div>
          </div>

          {/* Payment details */}
          <div className="px-6 md:px-8 py-6 bg-slate-900 rounded-lg mx-6 md:mx-8 mb-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-gray-600 mb-1">TOTAL PAYABLE:</p>
                <code className="text-2xl font-bold mb-4">
                  {formatCurrency(totalAmount!)}
                </code>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Text className="italic">Invoice ID:</Text>
                  <p className=" truncate">{invoiceId}</p>
                  <Text className="italic">Date Issued:</Text>
                  <p className="truncate">{dateIssued}</p>
                  <Text className="italic">Date Due:</Text>
                  <p className="truncate">{dateDue}</p>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <Text className="text-gray-400 mb-2">
                  For transfers, pay to:
                </Text>
                <p>
                  {accountNumber} - {bankName}
                </p>
                <p>{accountName}</p>

                <PaymentStatusBadge status={status as IOrderStatus} />
              </div>
            </div>
          </div>

          {/* Invoice items */}
          <div className="px-6 md:px-8 overflow-x-auto">
            <table className="w-full mb-6">
              <thead className="bg-slate-800 text-left">
                <tr>
                  <th className="py-4 px-4 font-medium">Name</th>
                  <th className="py-4 px-4 font-medium">QTY</th>
                  <th className="py-4 px-4 font-medium text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4">
                      <Text>{item.productName}</Text>
                    </td>

                    <td className="py-4 px-4">
                      <Text>{getOrderProductCount(items, item._id!)}</Text>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Text>
                        {" "}
                        {formatCurrency(item.discount || item.price.default)}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment info repeated */}
          <div className="px-6 md:px-8 mb-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-4 md:mb-0">
                <Text className="mb-2 font-bold">For transfers, pay to:</Text>
                <p>
                  {accountNumber} - {bankName}
                </p>
                <p>{accountName}</p>
              </div>

              <div className="w-full md:w-64">
                {Boolean(props.shippingDetails?.shippingCost) && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <code className="font-medium">
                      {formatCurrency(props.shippingDetails?.shippingCost!)}
                    </code>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">SUB TOTAL</span>
                  <code className="font-medium">
                    {formatCurrency(totalAmount!)}
                  </code>
                </div>

                <div className="bg-primary text-white rounded-none py-3 px-4 flex justify-between mt-2">
                  <span className="font-medium">TOTAL</span>
                  <code className="font-bold">
                    {formatCurrency(
                      totalAmount! + (props.shippingDetails?.shippingCost || 0)
                    )}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="p-5">
            <Text>
              © Invoices by <Logo className="text-sm text-primary" />
            </Text>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
