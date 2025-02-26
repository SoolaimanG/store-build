"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AddressFormData, ICustomerAddress } from "@/types";
import { FC, ReactNode, useState } from "react";
import {
  ChevronLeft,
  Search,
  MapPin,
  Plus,
  Edit3Icon,
  Trash2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { EmptyProductState } from "./empty";
import { useStoreBuildState } from "@/store";
import { toast } from "@/hooks/use-toast";
import { ConfirmationModal } from "./confirmation-modal";
import { Text } from "./text";
import { Switch } from "./ui/switch";

interface AddressFormProps {
  address?: ICustomerAddress | null;
  onSave: (address: ICustomerAddress) => void;
  onCancel: (prop?: boolean) => void;
  useStoreTheme?: boolean;
}

interface AddressCardProps {
  address: ICustomerAddress;
  onEdit: () => void;
  onDelete: () => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative rounded-lg border p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="mt-1">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{address.city}</span>
              {address.isDefault && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600">
                  Default
                </span>
              )}
            </div>
            <h3 className="font-medium">{address.addressLine1}</h3>
            <p className="text-sm text-gray-500">{""}</p>
            <p className="mt-1 text-sm text-gray-500">{address.addressLine1}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={onEdit}>
          <Edit3Icon size={17} />
          Edit address
        </Button>
        <ConfirmationModal
          onConfirm={onDelete}
          title="Delete Address"
          message="Are you sure you want to delete this address? This action cannot be undone."
        >
          <Button variant="destructive" size="sm" className="gap-1">
            <Trash2Icon size={17} />
            Delete address
          </Button>
        </ConfirmationModal>
      </div>
    </motion.div>
  );
}

export function AddressForm({
  address,
  onSave,
  onCancel,
  useStoreTheme,
}: AddressFormProps) {
  const [isHovered, setIsHovered] = useState(0);
  const { user, currentStore: store } = useStoreBuildState();
  const [formData, setFormData] = useState<AddressFormData>({
    isDefault: false,
    name: "",
    phone: "",
    addressLine: address?.addressLine1 || "",
    country: "Nigeria",
    state: address?.state || "",
    city: address?.city || "",
    zipCode: address?.postalCode || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const {
      name,
      phone,
      zipCode: postalCode,
      addressLine: addressLine1,
      ...props
    } = formData;

    onSave({
      _id: address?._id || undefined,
      postalCode,
      addressLine1,
      addressLine2: "",
      ...props,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onCancel()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">
          {address ? "Edit shipping address" : "Add New Store address"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Set as default</label>
              <Text className="text-xs">
                When this is turned on, the address will be use when calculating
                shipping cost for customers
              </Text>
            </div>
            <Switch
              checked={formData.isDefault}
              onCheckedChange={(e) => {
                setFormData({ ...formData, isDefault: e });
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Pin point</label>
            <iframe
              className="w-full h-[170px] rounded-lg"
              src={`https://nominatim.openstreetmap.org/ui/search.html?q=${formData.country} ${formData.state} ${formData.city}`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input required value={user?.storeName} readOnly />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <Input required value={user?.phoneNumber || ""} readOnly />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Address line 1 *</label>
            <Input
              required
              value={formData.addressLine}
              onChange={(e) =>
                setFormData({ ...formData, addressLine: e.target.value })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Country *</label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    defaultValue="Nigeria"
                    placeholder="Select a country"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">State *</label>
              <Input
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">City *</label>
              <Input
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Zip code </label>
              <Input
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            onMouseLeave={() => setIsHovered(0)}
            onMouseEnter={() => setIsHovered(1)}
            style={{
              borderColor: useStoreTheme
                ? store?.customizations?.theme.primary
                : "",
              background:
                isHovered === 1 ? store?.customizations?.theme.primary : "",
            }}
            type="button"
            variant="outline"
            onClick={() => onCancel()}
          >
            Cancel
          </Button>
          <Button
            style={{
              background: useStoreTheme
                ? store?.customizations?.theme.primary
                : "",
            }}
            type="submit"
          >
            Save changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

export function AddressList() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ICustomerAddress | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoading, data, error } = useQuery({
    queryKey: ["store-addresses"],
    queryFn: () => storeBuilder.getStoreAddresses(),
  });

  console.log({ isLoading, data, error });

  const { data: addresses = [] } = data || {};

  const filteredAddresses = addresses.filter(
    (address) =>
      address.addressLine1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address?.postalCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const revalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["store-addresses"] });
  };

  const handleEdit = (address: ICustomerAddress) => {
    setEditingAddress(address);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await storeBuilder.deleteStoreAddress(id);

      toast({
        title: "SUCCESS",
        description: res.message,
      });
      revalidate();
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    }
    // setAddresses(addresses.filter((address) => address.id !== id));
  };

  const handleSave = async (updatedAddress: ICustomerAddress) => {
    try {
      const res = await storeBuilder.addOrEditStoreAddress(updatedAddress);

      toast({
        title: "SUCCESS",
        description: res.message,
      });
      queryClient.invalidateQueries({ queryKey: ["store-addresses"] });
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
      setEditingAddress(null);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isEditing ? (
        <motion.div
          key="edit-form"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AddressForm
            address={editingAddress}
            onCancel={() => {
              setIsEditing(false);
              setEditingAddress(null);
            }}
            onSave={handleSave}
          />
        </motion.div>
      ) : (
        <motion.div key="address-list" className="space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" className="p-2">
              <MapPin className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Address</h1>
          </div>

          <Tabs defaultValue="shipping" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shipping">Shipping address</TabsTrigger>
              <TabsTrigger value="billing">Billing address</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search the address here"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setEditingAddress(null);
                setIsEditing(true);
              }}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add address
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-500">Address list</h2>
            {filteredAddresses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <EmptyProductState
                  icon={MapPin}
                  header="No Address Found"
                  message="To add a new address, please click the button below"
                >
                  <Button
                    variant="ringHover"
                    size="lg"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsEditing(true);
                    }}
                    className="mt-4"
                  >
                    Add address
                  </Button>
                </EmptyProductState>
              </motion.div>
            ) : (
              <motion.div layout className="space-y-4">
                {filteredAddresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    onEdit={() => handleEdit(address)}
                    onDelete={() => handleDelete(address._id!)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const ManageStoreAddress: FC<{
  open?: boolean;
  children?: ReactNode;
}> = ({ open = false, children }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isOpen, setIsOpen] = useState(open);

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
        {children && <DrawerTrigger>{children}</DrawerTrigger>}
        <DrawerContent className="p-3">
          <ScrollArea className="h-[580px]">
            <AddressList />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="max-w-xl">
        <ScrollArea className="h-[580px]">
          <AddressList />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
