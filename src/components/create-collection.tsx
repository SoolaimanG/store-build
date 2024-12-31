import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CollectionFormProps, ICategory } from "@/types";
import { FC, ReactNode, useState, ChangeEvent } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import IconSelector from "./icon-selector";
import { renderIcon } from "./icon-renderer";
import { Button } from "./ui/button";
import { errorMessageAndStatus, storeBuilder, uploadImage } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useStoreBuildState } from "@/store";
import { useQueryClient } from "@tanstack/react-query";

const CollectionForm = ({
  initialName,
  initialIcon,
  initialImage,
  onSave,
  onCancel,
}: CollectionFormProps) => {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage);

  const slot = name.replace(/\s+/g, "-").toLowerCase();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="collection-name">Collection Name</Label>
        <Input
          id="collection-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter collection name"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="collection-slot">Slot</Label>
        <Input
          id="collection-slot"
          value={slot}
          readOnly
          placeholder="Collection slot"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="collection-image">Collection Image</Label>
        <Input
          id="collection-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Collection preview"
              className="w-16 h-16 object-cover rounded-md"
            />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <Label>Collection Icon</Label>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {renderIcon(icon, "w-5 h-5 text-primary")}
          </div>
          <IconSelector onSelect={setIcon}>
            <Button variant="outline">Change Icon</Button>
          </IconSelector>
        </div>
      </div>
      <DialogFooter className="gap-2 pt-4">
        <Button
          variant="outline"
          className="hover:bg-transparent"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={() => onSave(name, icon, image, slot)}>
          Create Collection
        </Button>
      </DialogFooter>
    </div>
  );
};

export const CreateCollection: FC<
  {
    id?: number;
    name?: string;
    icon?: string;
    image?: string;
  } & { children: ReactNode }
> = ({ children, ...collection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useStoreBuildState();

  const handleSave = async (
    name: string,
    icon: string,
    image: File | null,
    slot: string
  ) => {
    try {
      let img;

      if (image) {
        const {
          data: { display_url },
        } = await uploadImage(image);
        img = display_url;
      }

      const payload: ICategory = {
        icon,
        name,
        slot,
        img,
        storeId: user?.storeId || "",
      };

      await storeBuilder.createCategory(payload);

      queryClient.invalidateQueries({
        queryKey: ["categories", user?.storeId],
      });

      toast({
        title: "SUCCESS",
        description: "New category/collection has been added successfully.",
      });
    } catch (error) {
      console.log(error);
      const err = errorMessageAndStatus(error);
      toast({
        title: err.status,
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{collection.id ? "Edit" : "Add"} Collection</DialogTitle>
          <DialogDescription>
            {collection.id
              ? "Edit the details of your collection."
              : "Create a new collection for your store."}
          </DialogDescription>
        </DialogHeader>
        <CollectionForm
          initialName={collection?.name || ""}
          initialIcon={collection?.icon || "ShoppingBag"}
          initialImage={collection?.image || ""}
          onSave={handleSave}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
