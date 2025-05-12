import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  IChatBotIntegration,
  IDeliveryIntegration,
  IIntegration,
  IPaymentIntegration,
} from "@/types";
import { Text } from "./text";
import { Check, ChevronDown, Plus, Shield, X } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Separator } from "./ui/separator";
import {
  chatBotLanguage,
  flutterwaveManagerSchema,
  nigeriaStates,
} from "@/constants";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { cn, errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import ConnectAppBtn from "./connect-app-btn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStoreBuildState } from "@/store";
import { useToastError } from "@/hooks/use-toast-error";
import { ManageStoreAddress } from "./manage-store-address";
import AddPhoneNumber from "./add-phone-number";
import { EmptyProductState } from "./empty";
import { ConfirmationModal } from "./confirmation-modal";
import { AddApiKeys } from "@/assets/add-api-keys";
import { Link } from "react-router-dom";

export function ManageIntegration({
  integration,
  children,
}: {
  integration: IIntegration;
  children: ReactNode;
}) {
  const { user } = useStoreBuildState();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [chatBotName, setChatBotName] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [isNationwide, setIsNationwide] = useState(false);
  const [imageCount, setImageCount] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isComboBoxOpen, setIsComboBoxOpen] = useState(false);
  const [isPending, startTransition] = useState(false);
  const [language, setLanguage] = useState("");

  const accessToken = "1234567890028839829028";

  const [chatbotPermissions, setChatbotPermissions] = useState<
    Record<string, boolean>
  >({
    products: false,
    orders: false,
    customers: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, error } = useQuery({
    queryKey: ["integration", integration.id],
    queryFn: () => storeBuilder.getIntegration(integration.id),
  });

  const { data: _integration } = data || {};

  useToastError(error);

  const form = useForm<z.infer<typeof flutterwaveManagerSchema>>({
    resolver: zodResolver(flutterwaveManagerSchema),
    defaultValues: {
      useCustomerDetails: false,
      storeName: "",
      storeEmail: "",
      storePhoneNumber: "",
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsComboBoxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!_integration) return;

    if (integration.id === "chatbot") {
      const { integration } = _integration;
      // @ts-ignore
      const settings = integration?.settings as IChatBotIntegration;

      setChatBotName(settings.name);
      setLanguage(settings.language);

      setChatbotPermissions({
        products: settings.permissions.allowProductAccess,
        orders: settings.permissions.allowOrderAccess,
        customers: settings.permissions.allowCustomerAccess,
      });
    }

    if (integration.id === "flutterwave") {
      const settings = // @ts-ignore
        _integration?.integration?.settings as IPaymentIntegration;

      form.setValue("storeEmail", user?.email);
      form.setValue("storeName", settings?.storeName || "");
      form.setValue("chargeCustomers", settings.chargeCustomers || false);
      form.setValue("storePhoneNumber", settings?.storePhoneNumber || "");
      form.setValue(
        "useCustomerDetails",
        settings?.useCustomerDetails || false
      );
    }

    if (integration.id === "sendbox") {
      const settings = // @ts-ignore
        _integration?.integration?.settings as IDeliveryIntegration;

      setSelectedStates(settings?.shippingRegions || []);
      setIsNationwide(settings?.deliveryNationwide || false);
    }

    if (integration.id === "unsplash") {
      const settings =
        // @ts-ignore
        _integration?.integration?.settings as { numberOfImages: number };

      setImageCount(settings.numberOfImages);
    }
  }, [_integration]);

  const handleStateToggle = (state: string) => {
    if (isNationwide) return;
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const handleIntegrationReload = () => {
    queryClient.invalidateQueries({ queryKey: ["integrations"] });
    queryClient.invalidateQueries({
      queryKey: ["integration", integration.id],
    });
  };

  const handleNationwideToggle = (checked: boolean) => {
    setIsNationwide(checked);
    if (checked) {
      setSelectedStates(nigeriaStates.map((state) => state.value));
    } else {
      setSelectedStates([]);
    }
  };

  const handleChatbotPermissionChange = (permission: string) => {
    setChatbotPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const manageSendBoxintegration = async () => {
    try {
      startTransition(true);

      const payload = {
        shippingRegions: selectedStates,
        deliveryNationwide: isNationwide,
      };

      const res = await storeBuilder.manageIntegration(integration.id, payload);

      setIsOpen(false);

      handleIntegrationReload();

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const err = errorMessageAndStatus(error);
      toast({
        title: err.status,
        description: err.message,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const manageChatBot = async () => {
    try {
      startTransition(true);

      const payload = {
        name: chatBotName,
        language,
        permissions: {
          allowProductAccess: chatbotPermissions.products,
          allowOrderAccess: chatbotPermissions.orders,
          allowCustomerAccess: chatbotPermissions.customers,
        },
      };

      const res = await storeBuilder.manageIntegration(integration.id, payload);

      handleIntegrationReload();

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const err = errorMessageAndStatus(error);
      toast({
        title: err.status,
        description: err.message,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const manageFlutterwave = async (
    value: z.infer<typeof flutterwaveManagerSchema>
  ) => {
    try {
      startTransition(true);

      const payload = {
        useCustomerDetails: value.useCustomerDetails,
        chargeCustomers: value.chargeCustomers,
        storeName: user?.storeName,
        storeEmail: user?.email,
        storePhoneNumber: "",
      };

      const res = await storeBuilder.manageIntegration(integration.id, payload);

      setIsOpen(false);

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const err = errorMessageAndStatus(error);
      toast({
        title: err.status,
        description: err.message,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const manageUnsplash = async () => {
    try {
      startTransition(true);
      const res = await storeBuilder.manageIntegration(integration.id, {
        numberOfImages: imageCount,
      });

      toast({
        title: "SUCCESS",
        description: res.message,
      });

      handleIntegrationReload();
      setIsOpen(false);
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const handleAddApiKey = async (data: {
    name: string;
    accessKey: string;
    token?: string;
    description?: string;
  }) => {
    await storeBuilder.addsendBoxApiKey(data?.token || data.accessKey);
  };

  const deleteSendBoxApiKey = async () => {
    try {
      const { message } = await storeBuilder.deleteSendBoxApiKey();
      queryClient.invalidateQueries({
        queryKey: ["integration", integration.id],
      });
      toast({
        title: "SUCCESS",
        description: message,
      });
    } catch (error) {
      toast({
        title: "ERROR",
        description: errorMessageAndStatus(error).message,
        variant: "destructive",
      });
    }
  };

  const filteredStates = nigeriaStates.filter((state) =>
    state.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const useCustomerDetails = form.watch("useCustomerDetails");

  const renderIntegrationOptions = () => {
    switch (integration.id) {
      case "flutterwave":
        return (
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(manageFlutterwave)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="useCustomerDetails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Use Customer Details
                        </FormLabel>
                        <FormDescription>
                          Toggle to use customer details for charges instead of
                          store details.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chargeCustomers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Charge Customers
                        </FormLabel>
                        <FormDescription>
                          Toggle to use charge customers for TAX instead of
                          store.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {!useCustomerDetails && (
                  <>
                    <FormField
                      control={form.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Your Store Name"
                              className="text-sm"
                              {...field}
                              value={user?.storeName}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="storePhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Store Phone Number</FormLabel>
                            <AddPhoneNumber type="button">
                              <Button variant="link" className="h-6">
                                Edit Phone Number
                              </Button>
                            </AddPhoneNumber>
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              placeholder="+1234567890"
                              className="text-sm"
                              value={user?.phoneNumber}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isLoading}
                >
                  {form.formState.isLoading
                    ? "Updating..."
                    : "Update Flutterwave Settings"}
                </Button>
              </form>
            </Form>
          </div>
        );

      case "chatbot":
        return (
          <div className="space-y-3">
            <Text>Configure your chatbot's behavior and permissions</Text>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="chatbot-name">Chatbot Name</Label>
                <Input
                  id="chatbot-name"
                  value={chatBotName}
                  onChange={(e) => setChatBotName(e.target.value)}
                  placeholder="Enter chatbot name"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  onValueChange={(e) => setLanguage(e)}
                  value={language}
                  defaultValue="english"
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      {chatBotLanguage.map(({ value, label }, idx) => (
                        <SelectItem key={idx} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-4">
                <Label>Chatbot Permissions</Label>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="products-permission">
                        Access Products
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow chatbot to access and discuss product information
                      </p>
                    </div>
                    <Switch
                      id="products-permission"
                      checked={chatbotPermissions.products}
                      onCheckedChange={() =>
                        handleChatbotPermissionChange("products")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="orders-permission">Access Orders</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow chatbot to view and handle order inquiries
                      </p>
                    </div>
                    <Switch
                      id="orders-permission"
                      checked={chatbotPermissions.orders}
                      onCheckedChange={() =>
                        handleChatbotPermissionChange("orders")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="customers-permission">
                        Access Customers
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow chatbot to access customer information
                      </p>
                    </div>
                    <Switch
                      id="customers-permission"
                      checked={chatbotPermissions.customers}
                      onCheckedChange={() =>
                        handleChatbotPermissionChange("customers")
                      }
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={manageChatBot}
                disabled={isPending}
                className="w-full"
              >
                Update Chatbot Settings
              </Button>
            </div>
          </div>
        );

      case "sendbox":
        return (
          <div className="space-y-5">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="md:text-2xl text-lg font-semibold">
                  Delivery Settings
                </h2>
                <Text className="tracking-tight">
                  Configure your delivery locations and preferences
                </Text>
              </div>
              <ManageStoreAddress>
                <Button variant="link" className="md:gap-">
                  <Plus size={18} /> Manage Address
                </Button>
              </ManageStoreAddress>
            </header>
            <div>
              <header></header>
            </div>
            <div className="space-y-6">
              {/* Access Token Section */}
              <div className="space-y-2 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={18} className="text-green-600" />
                  <Label htmlFor="accessToken" className="font-medium">
                    Access Token
                  </Label>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  Your access token is encrypted and securely stored. It's only
                  used for authenticating with our delivery service.
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="accessToken"
                      type={"password"}
                      value={_integration?.hasApiKeys ? accessToken : ""}
                      className="pr-10"
                      placeholder={
                        _integration?.hasApiKeys
                          ? "••••••••••••••••••••••"
                          : "API_KEYS_NOT_PROVIDED"
                      }
                      readOnly
                    />
                  </div>

                  {_integration?.hasApiKeys ? (
                    <ConfirmationModal
                      title="Delete SendBox Key"
                      message="Deleting this key means that you and your customers will not be able to access the sendBox integration anymore."
                      onConfirm={deleteSendBoxApiKey}
                    >
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </ConfirmationModal>
                  ) : (
                    <AddApiKeys onSubmit={handleAddApiKey}>
                      <Button variant="secondary" size="sm">
                        Update Token
                      </Button>
                    </AddApiKeys>
                  )}
                </div>

                <Button asChild variant="link" className="px-0">
                  <Link to={`https://app.sendbox.co`} target="_blank">
                    Get Access Token
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="nationwide">Deliver Nationwide</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable delivery to all states in Nigeria
                  </p>
                </div>
                <Switch
                  id="nationwide"
                  checked={isNationwide}
                  onCheckedChange={handleNationwideToggle}
                />
              </div>
              {!isNationwide && (
                <div className="space-y-2">
                  <Label>Select States</Label>
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isComboBoxOpen}
                      className="w-full justify-between"
                      onClick={() => setIsComboBoxOpen(!isComboBoxOpen)}
                    >
                      {selectedStates.length > 0
                        ? `${selectedStates.length} states selected`
                        : "Select states..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    {isComboBoxOpen && (
                      <div className="absolute bottom-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                        <div className="flex w-full items-center border-b">
                          <Input
                            autoComplete="off"
                            placeholder="Search states..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="focus:ring-0 focus:border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                        <ScrollArea className="h-[300px] overflow-auto p-1">
                          {filteredStates.map((state) => (
                            <div
                              key={state.value}
                              className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2"
                              onClick={() => handleStateToggle(state.value)}
                            >
                              <Check
                                size={18}
                                className={cn(
                                  selectedStates.includes(state.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {state.label}
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                  {selectedStates.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedStates.map((state) => (
                        <Badge
                          key={state}
                          variant="secondary"
                          className="text-xs capitalize bg-secondary/85 rounded-md"
                        >
                          {state}
                          <div
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleStateToggle(state);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleStateToggle(state);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </div>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {integration.connected && (
                <Button
                  disabled={isPending}
                  onClick={manageSendBoxintegration}
                  className="w-full"
                >
                  Update Delivery Settings
                </Button>
              )}
            </div>
          </div>
        );

      case "unsplash":
        return (
          <div className="space-y-3">
            <header>
              <h2 className="text-2xl font-semibold">Unsplash Settings</h2>
              <Text>Configure your Unsplash integration preferences</Text>
            </header>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-count">Number of Images</Label>
                <Select
                  value={imageCount.toString()}
                  onValueChange={(value) => setImageCount(parseInt(value))}
                >
                  <SelectTrigger id="image-count">
                    <SelectValue placeholder="Select number of images" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Max 3 images</SelectLabel>
                      <SelectItem value="1">1 Image</SelectItem>
                      <SelectItem value="2">2 Images</SelectItem>
                      <SelectItem value="3">3 Images</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button
                disabled={isPending}
                onClick={manageUnsplash}
                className="w-full"
              >
                Update Unsplash Settings
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <EmptyProductState
            header="404 -Not Found"
            message="No management options available for this integration."
          >
            <Button
              size="lg"
              variant="ringHover"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </EmptyProductState>
        );
    }
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="p-3">
          <DrawerHeader>
            <DrawerTitle>Manage {integration.name}</DrawerTitle>
          </DrawerHeader>
          {renderIntegrationOptions()}
          <ConnectAppBtn
            variant="outline"
            className="w-full"
            integrationId={integration.id}
            onSuccess={() => setIsOpen(false)}
          >
            <Button
              className="mt-2"
              variant={integration.connected ? "outline" : "default"}
            >
              {integration.connected ? "Disconnect" : "Connect"} Integration
            </Button>
          </ConnectAppBtn>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Manage {integration.name}</DialogTitle>
        </DialogHeader>
        {renderIntegrationOptions()}
        <DialogFooter>
          <ConnectAppBtn
            variant="outline"
            className="w-fit"
            integrationId={integration.id}
            onSuccess={() => setIsOpen(false)}
          >
            <Button className="mt-2" variant="outline">
              {integration.connected ? "Disconnect" : "Connect"} Integration
            </Button>
          </ConnectAppBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
