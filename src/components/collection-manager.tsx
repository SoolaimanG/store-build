import { useState } from "react";
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

interface CollectionProps {
  name: string;
  icon: string;
  showImage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onIconChange: (icon: string) => void;
}

const Collection = ({
  name,
  icon,
  showImage,
  onEdit,
  onDelete,
  onIconChange,
}: CollectionProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showImage ? (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Img
                src="/placeholder.svg"
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
          <h3 className="font-semibold">{name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit collection</span>
          </Button>
          {!showImage && (
            <IconSelector onSelect={onIconChange}>
              <Button variant="link" className="px-1" size="sm">
                Change Icon
              </Button>
            </IconSelector>
          )}
          <Button size="icon" variant="destructive" onClick={onDelete}>
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Delete collection</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CollectionManager = () => {
  const [collections, setCollections] = useState([
    { id: 1, name: "Beauty Bags", icon: "ShoppingBag" },
    { id: 2, name: "Accessories", icon: "Glasses" },
    { id: 3, name: "Footwear", icon: "Footprints" },
  ]);
  const [showImages, setShowImages] = useState(false);
  const [collectionHeading, setCollectionHeading] = useState("Our Collections");
  const [editingCollection, setEditingCollection] = useState<null | {
    id: number;
    name: string;
    icon: string;
    image?: string;
  }>(null);

  const handleAddCollection = () => {
    setEditingCollection(null);
  };

  const handleEditCollection = (collection: {
    id: number;
    name: string;
    icon: string;
  }) => {
    setEditingCollection(collection);
  };

  const handleDeleteCollection = (id: number) => {
    setCollections(collections.filter((c) => c.id !== id));
  };

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
              {collections.map((collection) => (
                <Collection
                  key={collection.id}
                  name={collection.name}
                  icon={collection.icon}
                  showImage={showImages}
                  onEdit={() => handleEditCollection(collection)}
                  onDelete={() => handleDeleteCollection(collection.id)}
                  onIconChange={(icon) => {
                    setCollections(
                      collections.map((c) =>
                        c.id === collection.id ? { ...c, icon } : c
                      )
                    );
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <footer>
        <Button className="w-full">Save Changes</Button>
      </footer>
    </div>
  );
};

export default CollectionManager;
