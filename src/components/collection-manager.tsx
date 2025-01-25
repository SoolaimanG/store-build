import { FC, useState } from "react";
import { PlusIcon, Pencil, Trash2Icon, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Img } from "react-image";
import IconSelector from "./icon-selector";
import { renderIcon } from "./icon-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Text } from "./text";
import { CreateCollection } from "./create-collection";
import { ICategory, IStore } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStoreBuildState } from "@/store";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { SaveChanges } from "./save-store-front-changes";
import { toast } from "@/hooks/use-toast";
import { ConfirmationModal } from "./confirmation-modal";

interface CollectionProps {
  id: string;
  name: string;
  icon: string;
  showImage: boolean;
  onEdit: () => void;
  img?: string;
  storeId?: string;
  onIconChange?: (icon: string) => void;
}

const Collection = ({
  id,
  name,
  icon,
  showImage,
  img = "",
  onEdit,
  storeId,
  onIconChange = () => {},
}: CollectionProps) => {
  const queryClient = useQueryClient();

  const changeIcon = async (icon: string) => {
    try {
      await storeBuilder.editCategory(id, { icon });

      queryClient.invalidateQueries({
        queryKey: ["categories", storeId],
      });
      onIconChange(icon);
      toast({
        title: "SUCCESS",
        description: "ICON has been changed successfully",
      });
    } catch (error) {
      console.log(error);
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async () => {
    try {
      await storeBuilder.deleteCategory(id);
      queryClient.invalidateQueries({
        queryKey: ["categories", storeId],
      });
      onIconChange(icon);
      toast({
        title: "SUCCESS",
        description: "Category deleted successfully.",
      });
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showImage ? (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Img
                src={img}
                alt={name}
                className="w-8 h-8 object-cover rounded-full"
                loader={
                  <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                }
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {renderIcon(icon, "w-5 h-5 text-primary")}
            </div>
          )}
          <h3 className="font-semibold line-clamp-1">{name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <CreateCollection id={id} name={name} icon={icon} image="">
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit collection</span>
            </Button>
          </CreateCollection>
          {!showImage && (
            <IconSelector onSelect={changeIcon}>
              <Button variant="link" className="px-1" size="sm">
                Change Icon
              </Button>
            </IconSelector>
          )}
          <ConfirmationModal
            onConfirm={deleteCategory}
            title="Delete Category"
            message="Are you sure you want to delete this category? This action cannot be undone"
          >
            <Button size="sm" variant="ghost">
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Delete collection</span>
            </Button>
          </ConfirmationModal>
        </div>
      </CardContent>
    </Card>
  );
};

const CollectionManager: FC<{ store?: Partial<IStore> }> = ({ store }) => {
  const { user } = useStoreBuildState();
  const [showImages, setShowImages] = useState(
    store?.customizations?.category?.showImage || false
  );
  const [collectionHeading, setCollectionHeading] = useState(
    store?.customizations?.category?.header || ""
  );
  const [editingCollection, setEditingCollection] = useState<null | ICategory>(
    null
  );

  const handleAddCollection = () => {
    setEditingCollection(null);
  };

  const handleEditCollection = (collection: ICategory) => {
    setEditingCollection(collection);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["categories", store?._id],
    queryFn: () => storeBuilder.getCategories(store?._id || user?._id || ""),
  });

  const { data: categories = [] } = data || {};

  useToastError(error);

  return (
    <div className="w-full space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Collection Manager</h2>
          <Text>Manage your store collections</Text>
        </div>
        <CreateCollection {...editingCollection}>
          <Button size="sm" onClick={handleAddCollection} className="gap-1">
            <PlusIcon className="h-4 w-4" />
            Create Collection
          </Button>
        </CreateCollection>
      </header>
      <div className="space-y-6 w-full">
        <div className="space-y-1 w-full">
          <Label htmlFor="collectionHeading">Collection Heading</Label>
          <Input
            id="collectionHeading"
            value={collectionHeading}
            onChange={(e) => setCollectionHeading(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="show-images">Use Images</Label>
            <p className="text-sm text-muted-foreground">
              Show images on collection sections instead of icons
            </p>
          </div>
          <Switch
            id="show-images"
            checked={showImages}
            onCheckedChange={setShowImages}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Collections</h2>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {categories.map((collection) => (
                <Collection
                  id={collection._id || ""}
                  key={collection._id}
                  name={collection.name}
                  icon={collection.icon}
                  showImage={showImages}
                  img={collection.img}
                  storeId={store?._id}
                  onEdit={() => handleEditCollection(collection)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <footer>
        <SaveChanges
          partial
          updates={{
            // @ts-ignore
            customizations: {
              ...store?.customizations,
              category: { header: collectionHeading, showImage: showImages },
            },
          }}
        />
      </footer>
    </div>
  );
};

export default CollectionManager;
