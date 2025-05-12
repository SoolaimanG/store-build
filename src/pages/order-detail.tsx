import type React from "react";
import Logo from "@/components/logo";
import OrderAndInvoiceProvider from "@/components/order-and-invoice-provider";
import { Text } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  errorMessageAndStatus,
  formatAmountToNaira,
  goToWhatsapp,
  storeBuilder,
} from "@/lib/utils";
import { PATHS, type IOrder, type IStore } from "@/types";
import {
  MessageCircle,
  MoveRight,
  ShoppingBasket,
  ChevronDown,
  MapPin,
  X,
  Check,
  PencilLineIcon,
  Ban,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { OrderTimeLine } from "@/components/order-timeline";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentTitle } from "@uidotdev/usehooks";
import CancelOrder from "@/components/cancel-order";

const OrderDetails = () => {
  const { id = "" } = useParams() as { id: string };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [order, setOrder] = useState<IOrder | undefined>(undefined);
  const [store, setStore] = useState<
    IStore & { phoneNumber?: string; email?: string }
  >();

  useDocumentTitle(`Order ${id} details`);

  // Edit mode states
  const [editingCustomerInfo, setEditingCustomerInfo] = useState(false);
  const [editingShippingAddress, setEditingShippingAddress] = useState(false);
  const [editingDeliveryNote, setEditingDeliveryNote] = useState(false);

  // Form data states
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [addressForm, setAddressForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [noteForm, setNoteForm] = useState("");
  const [showTimeline, setShowTimeline] = useState(false);

  // Update form data when order is loaded
  useEffect(() => {
    if (order) {
      setCustomerForm({
        name: order.customerDetails?.name || "",
        email: order.customerDetails?.email || "",
        phoneNumber: order.customerDetails?.phoneNumber || "",
      });

      setAddressForm({
        addressLine1:
          order?.customerDetails?.shippingAddress?.addressLine1 || "",
        addressLine2:
          order?.customerDetails?.shippingAddress?.addressLine2 || "",
        city: order?.customerDetails?.shippingAddress?.city || "",
        state: order?.customerDetails?.shippingAddress?.state || "",
        postalCode: order?.customerDetails?.shippingAddress?.postalCode || "",
        country: order?.customerDetails?.shippingAddress?.country || "",
      });

      setNoteForm(order?.note || "");
    }
  }, [order]);

  const {
    customerDetails,
    products,
    shippingDetails,
    paymentDetails,
    orderStatus,
    totalAmount,
  } = order || {};

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle customer info form changes
  const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle address form changes
  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save customer info changes
  const saveCustomerInfo = async () => {
    try {
      if (!order) return;

      await storeBuilder.editOrder(
        id,
        {
          customerDetails: {
            ...order.customerDetails,
            ...customerForm,
          },
        },
        phoneNumber
      );

      setOrder((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          customerDetails: {
            ...prev.customerDetails,
            name: customerForm.name,
            email: customerForm.email,
            phoneNumber: customerForm.phoneNumber,
          },
        };
      });

      setEditingCustomerInfo(false);
    } catch (error) {
      toast({
        title: "ERROR",
        description: errorMessageAndStatus(error).message,
        variant: "destructive",
      });
    }
  };

  // Cancel customer info edit
  const cancelCustomerInfoEdit = () => {
    if (!order) return;

    setCustomerForm({
      name: order.customerDetails.name || "",
      email: order.customerDetails.email || "",
      phoneNumber: order.customerDetails.phoneNumber || "",
    });

    setEditingCustomerInfo(false);
  };

  // Save shipping address changes
  const saveShippingAddress = async () => {
    try {
      if (!order) return;

      await storeBuilder.editOrder(
        id,
        {
          customerDetails: {
            ...order.customerDetails,
            shippingAddress: {
              ...order.customerDetails.shippingAddress,
              ...addressForm,
            },
          },
        },
        phoneNumber
      );

      setOrder((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          customerDetails: {
            ...prev.customerDetails,
            shippingAddress: {
              ...prev.customerDetails.shippingAddress,
              ...addressForm,
            },
          },
        };
      });

      toast({
        title: "SUCCESS",
        description: "Shipping address updated successfully.",
      });

      setEditingShippingAddress(false);
    } catch (error) {
      toast({
        title: "ERROR",
        description: errorMessageAndStatus(error).message,
        variant: "destructive",
      });
    }
  };

  // Cancel shipping address edit
  const cancelShippingAddressEdit = () => {
    if (!order) return;

    setAddressForm({
      addressLine1: order.customerDetails.shippingAddress.addressLine1 || "",
      addressLine2: order.customerDetails.shippingAddress.addressLine2 || "",
      city: order.customerDetails.shippingAddress.city || "",
      state: order.customerDetails.shippingAddress.state || "",
      postalCode: order.customerDetails.shippingAddress.postalCode || "",
      country: order.customerDetails.shippingAddress.country || "",
    });

    setEditingShippingAddress(false);
  };

  // Save delivery note changes
  const saveDeliveryNote = async () => {
    try {
      if (!order) return;

      await storeBuilder.editOrder(
        id,
        {
          note: noteForm,
        },
        phoneNumber
      );

      setOrder((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          note: noteForm,
        };
      });

      toast({
        title: "SUCCESS",
        description: "Delivery note updated successfully.",
      });

      setEditingDeliveryNote(false);
    } catch (error) {
      toast({
        title: "ERROR",
        description: errorMessageAndStatus(error).message,
        variant: "destructive",
      });
    }
  };

  // Cancel delivery note edit
  const cancelDeliveryNoteEdit = () => {
    if (!order) return;

    setNoteForm(order.note || "");
    setEditingDeliveryNote(false);
  };

  const viewOrder = async () => {
    setIsPending(true);
    try {
      const res = await storeBuilder.getOrder<{ order: IOrder; store: IStore }>(
        id,
        phoneNumber
      );
      setOrder(res.data.order);
      setStore(res.data.store);

      // Initialize form data with order data
      if (res.data) {
        setCustomerForm({
          name: res.data.order.customerDetails.name || "",
          email: res.data.order.customerDetails.email || "",
          phoneNumber: res.data.order.customerDetails.phoneNumber || "",
        });

        setAddressForm({
          addressLine1:
            res.data.order.customerDetails.shippingAddress.addressLine1 || "",
          addressLine2:
            res.data.order.customerDetails.shippingAddress.addressLine2 || "",
          city: res.data.order.customerDetails.shippingAddress.city || "",
          state: res.data.order.customerDetails.shippingAddress.state || "",
          postalCode:
            res.data.order.customerDetails.shippingAddress.postalCode || "",
          country: res.data.order.customerDetails.shippingAddress.country || "",
        });

        setNoteForm(res.data.order.note || "");
      }
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "ERROR",
        description,
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  if (!order) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-950/70">
        <div className="w-full md:max-w-lg flex flex-col gap-4 items-center max-w-[90%]">
          <Logo />
          <Card className="rounded-xl w-full">
            <CardContent className="flex w-full flex-col gap-3 items-center py-3 px-16">
              <div className="flex flex-row items-center justify-between bg-slate-900 p-3 rounded-full">
                <ShoppingBasket size={40} />
              </div>
              <div>
                <Text className="text-2xl font-extralight">
                  Enter phone number
                </Text>
                <h3 className="text-center text-2xl font-semibold">
                  To view this Order
                </h3>
              </div>
              <Input
                className="h-[3rem]"
                placeholder="+234 (803) (344) (6576)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <CardFooter className="w-full flex flex-col gap-2 px-0 mt-4">
                <Button
                  disabled={!phoneNumber || isPending}
                  onClick={viewOrder}
                  className="w-full h-[3rem]"
                >
                  View Order
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full gap-2 h-[3rem]"
                >
                  <Link to={PATHS.STORE_ORDERS} className="">
                    View as Seller
                    <MoveRight size={18} />
                  </Link>
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <OrderAndInvoiceProvider
        storeCode={store?.storeCode}
        addBackgroundToPaymentOptions
        phoneNumber={phoneNumber}
        headerBtn={
          <div className="flex items-center gap-1">
            <Button
              onClick={() =>
                goToWhatsapp(
                  //@ts-ignore
                  `+234${store?.phoneNumber}`,
                  `Hello, I want to make enquiry about order ${order._id}`
                )
              }
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <MessageCircle size={17} />
              <p className="md:block hidden">Contact Seller</p>
            </Button>
            <CancelOrder
              orderId={id}
              phoneNumber={phoneNumber}
              storeId={order.storeId}
            >
              <Button variant="destructive" size="sm" className="gap-2">
                <Ban size={17} />
                <p className="md:block hidden">Cancel Order</p>
              </Button>
            </CancelOrder>
          </div>
        }
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Store Header */}
          <div className="flex items-center gap-4 mb-8">
            <div>
              <Logo name={store?.storeName} />
              <Text dangerouslySetInnerHTML={{ __html: store?.aboutStore! }} />
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-slate-800/30 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Order Status:</h2>
              <span className="text-amber-500 font-medium uppercase">
                <PaymentStatusBadge status={orderStatus!} />
              </span>
            </div>
            <button
              className="flex items-center text-primary font-medium"
              onClick={() => setShowTimeline(!showTimeline)}
            >
              See Order Timeline{" "}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${
                  showTimeline ? "rotate-180" : ""
                }`}
              />
            </button>

            {showTimeline && (
              <OrderTimeLine
                createdAt={order.createdAt!}
                updatedAt={order.updatedAt!}
                estimatedDeliveryDate={
                  order.shippingDetails?.estimatedDeliveryDate!
                }
                orderStatus={order.orderStatus!}
              />
            )}
          </div>

          {/* Order Summary */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Order Summary</h2>
            </div>

            <div className="bg-slate-800/30 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_auto] p-4 bg-slate-900">
                <div className="font-medium text-gray-600">PRODUCT</div>
                <div className="font-medium text-gray-600">PRICE</div>
              </div>

              <ScrollArea className="h-[200px] p-3">
                {products?.map((product) => (
                  <div
                    key={product._id}
                    className="p-4 grid grid-cols-[1fr_auto] gap-4 items-center border-b border-gray-200"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={product.media?.[0]?.url || "/placeholder.svg"}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{product.productName}</h3>
                        <p className="text-sm text-gray-500">
                          Color:{" "}
                          {product.color ||
                            product.availableColors?.[0]?.name ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                    <code className="font-medium">
                      {formatAmountToNaira(product.price?.default || 0)}
                    </code>
                  </div>
                ))}
              </ScrollArea>

              <div className="p-4 grid grid-cols-[1fr_auto] gap-4 items-center">
                <div className="font-medium">GRAND TOTAL</div>
                <code className="font-bold">
                  {formatAmountToNaira(totalAmount || 0)}
                </code>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Delivery details</h2>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 items-start">
                  <MapPin className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="w-full">
                    <h3 className="font-medium text-lg mb-1">
                      Delivery Method
                    </h3>
                    <Text>
                      {order.deliveryType === "waybill"
                        ? "Shipping"
                        : order.deliveryType}
                    </Text>

                    {/* Customer Information Section */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Contact Information</h4>
                        {!editingCustomerInfo ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCustomerInfo(true)}
                            className="h-8 px-2 rounded-full"
                          >
                            <PencilLineIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelCustomerInfoEdit}
                              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={saveCustomerInfo}
                              className="h-8 px-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {!editingCustomerInfo ? (
                        <>
                          <Text>{customerDetails?.name}</Text>
                          <Text>{customerDetails?.email}</Text>
                          <Text>{customerDetails?.phoneNumber}</Text>
                        </>
                      ) : (
                        <div className="space-y-3 mt-3 bg-slate-800/65 p-4 rounded-md">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={customerForm.name}
                              onChange={handleCustomerFormChange}
                              className="mt-1 h-[3rem]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={customerForm.email}
                              onChange={handleCustomerFormChange}
                              className="mt-1 h-[3rem]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                              id="phoneNumber"
                              name="phoneNumber"
                              value={customerForm.phoneNumber}
                              onChange={handleCustomerFormChange}
                              className="mt-1 h-[3rem]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shipping Address Section */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Shipping Address</h4>
                        {!editingShippingAddress ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingShippingAddress(true)}
                            className="h-8 px-2 rounded-full"
                          >
                            <PencilLineIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelShippingAddressEdit}
                              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={saveShippingAddress}
                              className="h-8 px-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {!editingShippingAddress ? (
                        <>
                          <Text>{customerDetails?.name}</Text>
                          <Text>
                            {customerDetails?.shippingAddress?.addressLine1}
                          </Text>
                          {customerDetails?.shippingAddress?.addressLine2 && (
                            <Text>
                              {customerDetails?.shippingAddress?.addressLine2}
                            </Text>
                          )}
                          <Text>
                            {customerDetails?.shippingAddress?.city},{" "}
                            {customerDetails?.shippingAddress?.postalCode}
                          </Text>
                          <Text>
                            {customerDetails?.shippingAddress?.country}
                          </Text>
                        </>
                      ) : (
                        <div className="space-y-3 mt-3 bg-slate-800/65 p-4 rounded-md">
                          <div>
                            <Label htmlFor="addressLine1">Address Line 1</Label>
                            <Input
                              id="addressLine1"
                              name="addressLine1"
                              value={addressForm.addressLine1}
                              onChange={handleAddressFormChange}
                              className="mt-1 h-[3rem]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="addressLine2">Address Line 2</Label>
                            <Input
                              id="addressLine2"
                              name="addressLine2"
                              value={addressForm.addressLine2}
                              onChange={handleAddressFormChange}
                              className="mt-1 h-[3rem]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                name="city"
                                value={addressForm.city}
                                onChange={handleAddressFormChange}
                                className="mt-1 h-[3rem]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State</Label>
                              <Input
                                id="state"
                                name="state"
                                value={addressForm.state}
                                onChange={handleAddressFormChange}
                                className="mt-1 h-[3rem]"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="postalCode">Postal Code</Label>
                              <Input
                                id="postalCode"
                                name="postalCode"
                                value={addressForm.postalCode}
                                onChange={handleAddressFormChange}
                                className="mt-1 h-[3rem]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                name="country"
                                value={addressForm.country}
                                onChange={handleAddressFormChange}
                                className="mt-1 h-[3rem]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Note Section */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Delivery Note</h4>
                        {!editingDeliveryNote ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDeliveryNote(true)}
                            className="h-8 px-2 rounded-full"
                          >
                            <PencilLineIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelDeliveryNoteEdit}
                              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={saveDeliveryNote}
                              className="h-8 px-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {!editingDeliveryNote ? (
                        <div className="p-3 bg-slate-900/90 rounded-md">
                          <Text className="font-bold">
                            {order.note || "No delivery note provided."}
                          </Text>
                        </div>
                      ) : (
                        <div className="mt-3 bg-slate-800/65 p-4 rounded-md">
                          <Textarea
                            value={noteForm}
                            onChange={(e) => setNoteForm(e.target.value)}
                            placeholder="Add delivery instructions here..."
                            className="min-h-[100px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Shipping Details Section */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Shipping Details</h4>
                      <Text>Carrier: {shippingDetails?.carrier}</Text>
                      <Text>
                        Tracking Number: {shippingDetails?.trackingNumber}
                      </Text>
                      <Text>
                        Estimated Delivery:{" "}
                        {formatDate(
                          shippingDetails?.estimatedDeliveryDate || ""
                        )}
                      </Text>
                    </div>

                    {/* Payment Information Section */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Payment Information</h4>
                      <Text>Method: {paymentDetails?.paymentMethod}</Text>
                      <Text>Status: {paymentDetails?.paymentStatus}</Text>
                      <Text>
                        Transaction ID: {paymentDetails?.transactionId}
                      </Text>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </OrderAndInvoiceProvider>
    </div>
  );
};

export default OrderDetails;
