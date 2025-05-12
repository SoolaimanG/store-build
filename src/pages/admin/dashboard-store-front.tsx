import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Camera,
  CheckIcon,
  Edit,
  ImageIcon,
  Layout,
  Link,
  Loader2,
  PackageOpen,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useState, useRef, FC, useEffect } from "react";
import { motion } from "framer-motion";
import {
  cn,
  errorMessageAndStatus,
  getInitials,
  storeBuilder,
  uploadImage,
} from "@/lib/utils";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TextEditor from "@/components/text-editor";
import CollectionManager from "@/components/collection-manager";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, ListFilter, ArrowUpDown } from "lucide-react";
import {
  IDisplay,
  IDisplayStyle,
  IProductPage,
  IProductToShow,
  ISection,
  ISortBy,
  IStore,
  IStoreFeatureProps,
  IStoreFeatures,
  IStoreHeroSection,
  IStoreTheme,
  PATHS,
} from "@/types";
import { Text } from "@/components/text";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { SaveChanges } from "@/components/save-store-front-changes";
import { useStoreBuildState } from "@/store";
import { ProductSelector } from "@/components/product-selector";
import { ImageUploader } from "@/components/image-uploader";
import { useDocumentTitle } from "@uidotdev/usehooks";

interface Tab {
  label: string;
  content:
    | React.FC<{
        store: Partial<IStore>;
      }>
    | React.FC<{
        store?: Partial<IStore>;
      }>;
  path: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
}

const StoreFrontSettings: FC<{ store: Partial<IStore> }> = ({ store }) => {
  const [profilePicture, setProfilePicture] = useState(
    store.customizations?.logoUrl || ""
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(
    store.customizations?.theme
  );
  const [settings, setSettings] = useState<Partial<IStore>>({
    isActive: store.isActive || false,
    storeName: store.storeName,
    aboutStore: store.aboutStore,
    description: store.description,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setProfilePicture(imageUrl);
      setImageUrl("");
      setIsDialogOpen(false);
    }
  };

  const handleFileSubmit = async () => {
    try {
      if (selectedFile) {
        const res = await uploadImage(selectedFile);
        setProfilePicture(res.data.display_url);

        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Something went wrong",
      });
    }
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["themes"],
    queryFn: () => storeBuilder.getThemes(),
  });

  const { data: themes } = data || {};

  useToastError(error);

  return (
    <section>
      <h2 className="text-2xl font-semibold">Store Settings</h2>
      <form className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative w-32 h-32 rounded-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsDialogOpen(false);
            }}
          >
            <Avatar className="w-full h-full object-cover">
              <AvatarImage src={profilePicture} alt="Store Logo" />
              <AvatarFallback>{getInitials(store.storeName)}</AvatarFallback>
            </Avatar>

            {isHovered && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                    <p className="text-sm">Update Logo</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                    <DialogDescription>
                      Choose a new profile picture by uploading a file or
                      providing a URL.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                      <TabsTrigger value="url">URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <Label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </div>
                            <Input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                          </Label>
                        </div>
                        {selectedFile && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {selectedFile.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFile(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <Button
                          className="w-full"
                          type="button"
                          onClick={handleFileSubmit}
                          disabled={!selectedFile}
                        >
                          Upload Image
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="url">
                      <div className="flex flex-col items-center space-y-4">
                        <Input
                          type="url"
                          placeholder="Enter image URL"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full"
                        />
                        <Button
                          type="button"
                          onClick={handleUrlSubmit}
                          disabled={!imageUrl}
                        >
                          <Link className="mr-2 h-4 w-4" /> Set Image URL
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Label className="mt-2 text-sm text-muted-foreground">
            Store Logo
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-lg">Store Status</Label>
            <div className="text-sm text-muted-foreground">
              Enable or disable your store
            </div>
          </div>
          <Switch
            checked={settings.isActive}
            onCheckedChange={(e) => setSettings({ ...settings, isActive: e })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            value={settings.storeName}
            onChange={(e) =>
              setSettings({ ...settings, storeName: e.target.value })
            }
            id="storeName"
            placeholder="Enter your store name"
          />
        </div>

        <div className="space-y-2">
          <Label>About Us</Label>
          <TextEditor
            className="text-sm"
            onChange={(e) => setSettings({ ...settings, aboutStore: e })}
            text={settings.aboutStore || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            value={settings.description}
            className="text-sm"
            onChange={(e) =>
              setSettings({ ...setSettings, description: e.target.value })
            }
            id="description"
            placeholder="Enter a short description of your store"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>

          <div className="flex items-center gap-4 flex-wrap">
            {isLoading
              ? [1, 2, 3, 5].map((_) => (
                  <Skeleton key={_} className="w-24 h-10" />
                ))
              : themes?.map((theme, idx) => (
                  <div key={idx} onClick={() => setSelectedTheme(theme)}>
                    <div className="flex items-center">
                      <div className="flex cursor-pointer w-full relative">
                        {theme.id === selectedTheme?.id && (
                          <div className=" absolute w-full h-full flex items-center justify-center">
                            <CheckIcon />
                          </div>
                        )}
                        <div
                          className="w-10 h-10"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="w-10 h-10"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
        <SaveChanges
          updates={{
            ...settings,
            // @ts-ignore
            customizations: {
              ...store.customizations,
              logoUrl: profilePicture,
              theme: selectedTheme as IStoreTheme,
            },
          }}
        />
      </form>
    </section>
  );
};

interface ProductPageCustomizations {
  canFilter: boolean;
  canSearch: boolean;
  sort: ISortBy[];
  havePagination: boolean;
}

const StoreFrontProductsPage: FC<{ store: Partial<IStore> }> = ({ store }) => {
  const [customizations, setCustomizations] =
    useState<ProductPageCustomizations>({
      canFilter: store.customizations?.productsPages.canFilter || false,
      canSearch: store.customizations?.productsPages.canSearch || false,
      sort: store.customizations?.productsPages.sort || ["price", "name"],
      havePagination:
        store.customizations?.productsPages.havePagination || false,
    });

  const sortOptions: ISortBy[] = ["price", "name", "date", "discount"];

  const handleToggle = (key: keyof ProductPageCustomizations) => {
    setCustomizations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSortToggle = (sortBy: ISortBy) => {
    setCustomizations((prev) => ({
      ...prev,
      sort: prev.sort.includes(sortBy)
        ? prev.sort.filter((s) => s !== sortBy)
        : [...prev.sort, sortBy],
    }));
  };

  return (
    <div className="w-full space-y-5">
      <header>
        <h2 className="md:text-xl text-lg font-semibold">
          Product Page Customizations
        </h2>
        <Text className="tracking-tight">
          Tailor your product page to perfection
        </Text>
      </header>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Feature Toggles</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-none">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-primary" />
                <Label htmlFor="canFilter" className="flex flex-col">
                  <span className="font-medium">Enable Filtering</span>
                  <span className="text-sm text-muted-foreground">
                    Allow users to filter products
                  </span>
                </Label>
              </div>
              <Switch
                id="canFilter"
                checked={customizations.canFilter}
                onCheckedChange={() => handleToggle("canFilter")}
              />
            </div>
            <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-none">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-primary" />
                <Label htmlFor="canSearch" className="flex flex-col">
                  <span className="font-medium">Enable Search</span>
                  <span className="text-sm text-muted-foreground">
                    Allow users to search for products
                  </span>
                </Label>
              </div>
              <Switch
                id="canSearch"
                checked={customizations.canSearch}
                onCheckedChange={() => handleToggle("canSearch")}
              />
            </div>
            <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-none">
              <div className="flex items-center space-x-2">
                <ListFilter className="w-5 h-5 text-primary" />
                <Label htmlFor="havePagination" className="flex flex-col">
                  <span className="font-medium">Enable Pagination</span>
                  <span className="text-sm text-muted-foreground">
                    Divide products into pages
                  </span>
                </Label>
              </div>
              <Switch
                id="havePagination"
                checked={customizations.havePagination}
                onCheckedChange={() => handleToggle("havePagination")}
              />
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold mb-4">Sorting Options</h3>
          <div className="space-y-3">
            <Label className="text-base flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-primary" />
              <span>Available Sorting Criteria</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {sortOptions.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 bg-secondary p-2 rounded-none"
                >
                  <Checkbox
                    id={option}
                    checked={customizations.sort.includes(option)}
                    onCheckedChange={() => handleSortToggle(option)}
                  />
                  <Label htmlFor={option} className="capitalize font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col space-y-4 pt-6">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="rounded-none border-2 border-primary"
          >
            Filters: {customizations.canFilter ? "Enabled" : "Disabled"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-none border-2 border-primary"
          >
            Search: {customizations.canSearch ? "Enabled" : "Disabled"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-none border-2 border-primary"
          >
            Pagination: {customizations.havePagination ? "Enabled" : "Disabled"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-none border-2 border-primary"
          >
            Sort Options: {customizations.sort.length}
          </Badge>
        </div>
        <SaveChanges
          updates={{
            // @ts-ignore
            customizations: {
              ...store.customizations,
              productsPages: {
                ...store.customizations?.productsPages,
                canFilter: customizations.canFilter,
                canSearch: customizations.canSearch,
                sort: customizations.sort,
                havePagination: customizations.havePagination,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

const StoreFrontProductPage: FC<{ store: Partial<IStore> }> = ({ store }) => {
  const [style, setStyle] = useState<IProductPage>({
    showSimilarProducts:
      store.customizations?.productPage.showSimilarProducts || false,
    style: store.customizations?.productPage.style || "one",
    showReviews: store.customizations?.productPage.showReviews || false,
  });

  const handleToggle = (key: keyof IProductPage) => {
    setStyle((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStyleChange = (newStyle: IDisplayStyle) => {
    setStyle((prev) => ({ ...prev, style: newStyle }));
  };

  return (
    <div className="w-full space-y-5">
      <header>
        <h2 className="md:text-2xl text-lg font-semibold">
          Product Page Style Customizer
        </h2>
        <Text className="tracking-tight">
          Customize the layout and features of your product pages
        </Text>
      </header>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-sm">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <Label htmlFor="showSimilarProducts" className="flex flex-col">
                <span className="font-medium">Show Similar Products</span>
                <span className="text-sm text-muted-foreground">
                  Display related items to encourage more purchases
                </span>
              </Label>
            </div>
            <Switch
              id="showSimilarProducts"
              checked={style.showSimilarProducts}
              onCheckedChange={() => handleToggle("showSimilarProducts")}
            />
          </div>
          <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-sm">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-primary" />
              <Label htmlFor="showReviews" className="flex flex-col">
                <span className="font-medium">Show Reviews</span>
                <span className="text-sm text-muted-foreground">
                  Display customer reviews and ratings
                </span>
              </Label>
            </div>
            <Switch
              id="showReviews"
              checked={style.showReviews}
              onCheckedChange={() => handleToggle("showReviews")}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Display Style</Label>
          <RadioGroup
            value={style.style}
            onValueChange={(value) => handleStyleChange(value as IDisplayStyle)}
            className="grid grid-cols-3 gap-4"
          >
            {(["one", "two", "three"] as const).map((styleOption) => (
              <div key={styleOption}>
                <RadioGroupItem
                  value={styleOption}
                  id={styleOption}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={styleOption}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Layout className="mb-3 h-6 w-6" />
                  <span className="capitalize">{styleOption}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      <Separator />
      <footer className="flex flex-col space-y-4 pt-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-sm border-2">
            Similar Products: {style.showSimilarProducts ? "Shown" : "Hidden"}
          </Badge>
          <Badge variant="outline" className="rounded-sm border-2">
            Reviews: {style.showReviews ? "Shown" : "Hidden"}
          </Badge>
          <Badge variant="outline" className="rounded-sm border-2 capitalize">
            Display Style: {style.style}
          </Badge>
        </div>
        <SaveChanges
          updates={{
            // @ts-ignore
            customizations: {
              ...store.customizations,
              productPage: {
                ...store.customizations?.productPage,
                showReviews: style.showReviews,
                showSimilarProducts: style.showSimilarProducts,
                style: style.style,
              },
            },
          }}
        />
      </footer>
    </div>
  );
};

const StoreFrontSectionManager: FC<{ store: Partial<IStore> }> = ({
  store,
}) => {
  const [sections, setSections] = useState<ISection[]>(store.sections || []);
  const [editingSection, setEditingSection] = useState<ISection | null>(null);

  const handleAddSection = () => {
    const newSection: ISection = {
      _id: editingSection?._id,
      header: "",
      products: "random",
      display: "grid",
    };
    setSections([...sections, newSection]);
    setEditingSection(newSection);
  };

  const handleEditSection = (section: ISection) => {
    setEditingSection(section);
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((section) => section._id !== id));
    if (editingSection?._id === id) {
      setEditingSection(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <header>
          <h2 className="text-2xl font-semibold">Section Manager</h2>
          <Text>Create, edit, and delete sections for your storefront</Text>
        </header>
        <div>
          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 text-muted-foreground">
              <PackageOpen className="h-12 w-12" />
              <p>
                No sections added yet. Click the button below to create your
                first section.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-3 w-full">
              {sections.map((section, idx) => (
                <Card key={idx}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h2 className="text-sm font-medium">
                      {section.header || "Untitled Section"}
                    </h2>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSection(section)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <SaveChanges
                        size="sm"
                        variant="ghost"
                        onSave={() => handleDeleteSection(section._id || "")}
                        updates={{
                          sections: store?.sections?.filter(
                            (s) => s._id !== section?._id
                          ),
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </SaveChanges>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground capitalize">
                      Products: {section.products}, Display: {section.display}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <footer>
          <Button onClick={handleAddSection} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Section
          </Button>
        </footer>
      </div>

      {editingSection && !!sections.length && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {editingSection._id ? "Edit" : "Add"} Section
            </h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="header">Header</Label>
                <Input
                  id="header"
                  value={editingSection.header}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      header: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="products">Products to Show</Label>
                <Select
                  value={editingSection.products}
                  onValueChange={(value: IProductToShow) =>
                    setEditingSection({ ...editingSection, products: value })
                  }
                >
                  <SelectTrigger id="products">
                    <SelectValue placeholder="Select products to show" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random</SelectItem>
                    <SelectItem value="best-sellers">Best Sellers</SelectItem>
                    <SelectItem value="expensive">Expensive</SelectItem>
                    <SelectItem value="discounted">Discounted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display">Display Style</Label>
                <Select
                  value={editingSection.display}
                  onValueChange={(value: IDisplay) =>
                    setEditingSection({ ...editingSection, display: value })
                  }
                >
                  <SelectTrigger id="display">
                    <SelectValue placeholder="Select display style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="flex">Flex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingSection(null)}>
              Cancel
            </Button>
            <SaveChanges
              onSave={(store) => setSections(store.sections)}
              updates={{
                sections: sections.map((section) =>
                  section._id === editingSection._id ? editingSection : section
                ),
              }}
              btnText="Save Section"
              className="w-fit"
            />
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

const StoreFrontFeaturesSectionManager: FC<{ store: Partial<IStore> }> = ({
  store,
}) => {
  const queryClient = useQueryClient();
  const [featuresSection, setFeaturesSection] = useState<IStoreFeatureProps>({
    showFeatures: store.customizations?.features.showFeatures || false,
    features: store.customizations?.features.features || [],
    style: store.customizations?.features.style || "one",
  });
  const [editingFeature, setEditingFeature] = useState<IStoreFeatures | null>(
    null
  );
  const [isPending, startTransition] = useState(false);

  const handleToggleFeatures = () => {
    setFeaturesSection((prev) => ({
      ...prev,
      showFeatures: !prev.showFeatures,
    }));
  };

  const handleStyleChange = (style: IDisplayStyle) => {
    setFeaturesSection((prev) => ({ ...prev, style }));
  };

  const handleAddFeature = () => {
    const newFeature: IStoreFeatures = {
      _id: editingFeature?._id,
      header: "",
      description: "",
      style: "one",
      image: "",
    };
    setFeaturesSection((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
    setEditingFeature(newFeature);
  };

  const handleEditFeature = (feature: IStoreFeatures) => {
    setEditingFeature(feature);
  };

  const handleStoreUpdate = async (
    updates: Partial<IStore>,
    isToggle = true
  ) => {
    try {
      startTransition(true);
      const res = await storeBuilder.editStore(updates, true);

      if (isToggle) {
        handleToggleFeatures();
      } else {
        handleStyleChange(
          updates.customizations?.features.style as IDisplayStyle
        );
      }

      queryClient.invalidateQueries({ queryKey: ["store"] });

      toast({
        title: "Success",
        description: res.message,
      });
    } catch (error) {
      const { message: description, status: title } =
        errorMessageAndStatus(error);
      toast({ title, description, variant: "destructive" });
    } finally {
      startTransition(false);
    }
  };

  const { data, error } = useQuery({
    queryKey: ["integration", "unsplash"],
    queryFn: () => storeBuilder.getIntegration("unsplash"),
  });

  const { data: integration } = data || {};
  const unsplashIntegration = integration?.integration;

  useToastError(error);

  return (
    <div className="space-y-5 w-full">
      <div className="space-y-5 w-full">
        <header>
          <h2 className="md:text-2xl text-lg font-semibold">
            Features Section Manager
          </h2>
          <Text>Manage the features section of your store</Text>
        </header>
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-features">Show Features Section</Label>
            <Switch
              id="show-features"
              disabled={isPending}
              checked={featuresSection.showFeatures}
              onCheckedChange={(e) =>
                handleStoreUpdate({
                  // @ts-ignore
                  customizations: {
                    ...store.customizations,
                    features: {
                      ...(store.customizations?.features as IStoreFeatureProps),
                      showFeatures: e,
                    },
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-style">Section Display Style</Label>
            <Select
              disabled={isPending}
              value={featuresSection.style}
              onValueChange={(value: IDisplayStyle) => {
                handleStoreUpdate(
                  {
                    // @ts-ignore
                    customizations: {
                      ...store.customizations,
                      features: {
                        ...(store.customizations
                          ?.features as IStoreFeatureProps),
                        style: value,
                      },
                    },
                  },
                  false
                );
              }}
            >
              <SelectTrigger id="section-style">
                <SelectValue placeholder="Select display style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">Style One</SelectItem>
                <SelectItem value="two">Style Two</SelectItem>
                <SelectItem value="three">Style Three</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {featuresSection.features.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 text-muted-foreground">
              <PackageOpen className="h-12 w-12" />
              <p>
                No features added yet. Click the button below to add your first
                feature.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {featuresSection.features.map((feature) => (
                <Card key={feature._id} className="">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h2 className="text-sm font-medium">
                      {feature.header || "Untitled Feature"}
                    </h2>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFeature(feature)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <SaveChanges
                        onSave={(store) => {
                          setFeaturesSection(
                            store.customizations?.features as IStoreFeatureProps
                          );
                        }}
                        updates={{
                          // @ts-ignore
                          customizations: {
                            ...store.customizations,
                            features: {
                              ...(store.customizations
                                ?.features as IStoreFeatureProps),
                              features:
                                store.customizations?.features.features.filter(
                                  (f) => f._id !== feature._id
                                ) || [],
                            },
                          },
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </SaveChanges>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Text className="text-xs">{feature.description}</Text>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <footer>
          <Button onClick={handleAddFeature} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Feature
          </Button>
        </footer>
      </div>

      {editingFeature && !!featuresSection.features.length && (
        <Card>
          <CardHeader>
            <h2>{editingFeature._id ? "Edit" : "Add"} Feature</h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feature-header">Header</Label>
                <Input
                  id="feature-header"
                  value={editingFeature.header}
                  onChange={(e) =>
                    setEditingFeature({
                      ...editingFeature,
                      header: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature-description">Description</Label>
                <Textarea
                  id="feature-description"
                  value={editingFeature.description}
                  onChange={(e) =>
                    setEditingFeature({
                      ...editingFeature,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature-style">Feature Style</Label>
                <Select
                  value={editingFeature.style}
                  onValueChange={(value: IDisplayStyle) =>
                    setEditingFeature({ ...editingFeature, style: value })
                  }
                >
                  <SelectTrigger id="feature-style">
                    <SelectValue placeholder="Select feature style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one">Style One</SelectItem>
                    <SelectItem value="two">Style Two</SelectItem>
                    <SelectItem value="three">Style Three</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature-image">Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="feature-image"
                    value={editingFeature.image}
                    onChange={(e) =>
                      setEditingFeature({
                        ...editingFeature,
                        image: e.target.value,
                      })
                    }
                    placeholder="Enter image URL"
                  />
                  {unsplashIntegration?.isConnected && (
                    <Button type="button" size="sm">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingFeature(null)}>
              Cancel
            </Button>
            <SaveChanges
              onSave={(store) =>
                setFeaturesSection(
                  store.customizations?.features as IStoreFeatureProps
                )
              }
              className="w-fit"
              updates={{
                // @ts-ignore
                customizations: {
                  ...store.customizations,
                  features: {
                    ...(store.customizations?.features as IStoreFeatureProps),
                    features: featuresSection?.features?.map((feature) =>
                      feature._id === editingFeature._id
                        ? editingFeature
                        : feature
                    ),
                  },
                },
              }}
            >
              Save Feature
            </SaveChanges>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

const StoreFrontHeroSection: FC<{ store: Partial<IStore> }> = ({ store }) => {
  const [heroSection, setHeroSection] = useState<IStoreHeroSection>({
    product: store.customizations?.hero?.product || "",
    message: store.customizations?.hero?.message || "",
    description: store.customizations?.hero?.description || "",
    btnAction: store.customizations?.hero?.btnAction || "addToCart",
    image: store.customizations?.hero?.image || "",
    style: store.customizations?.hero?.style || "one",
  });

  const handleChange = (key: keyof IStoreHeroSection, value: string) => {
    setHeroSection((prev) => ({ ...prev, [key]: value }));
  };

  const { data, error } = useQuery({
    queryKey: ["integration", "splash"],
    queryFn: () => storeBuilder.getIntegration("unsplash"),
  });

  const { data: _data, error: productError } = useQuery({
    queryKey: ["product", heroSection.product],
    queryFn: () => storeBuilder.getProduct(heroSection.product || ""),
    enabled: Boolean(heroSection.product),
  });

  useToastError(error || productError);

  const { data: integration } = data || {};
  const { data: product } = _data || {};

  const _uploadImage = async (files: File[]) => {
    try {
      const {
        data: { display_url },
      } = await uploadImage(files[0]);
      setHeroSection({ ...heroSection, image: display_url });

      toast({
        title: "SUCCESS",
        description: "Image upload successfully",
      });
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Hero Section Manager</h2>
        <Text>Customize your store's hero section</Text>
      </header>

      <div>
        <header>
          <h3 className="text-lg font-semibold">Hero Content</h3>
        </header>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Featured Product</Label>
            <div className="flex items-center gap-2">
              <Input
                className="w-[70%]"
                id="product"
                value={heroSection.product}
                readOnly
                placeholder="Enter featured product name"
              />
              <ProductSelector
                products={product ? [product] : []}
                onSelect={(products) =>
                  setHeroSection({
                    ...heroSection,
                    product: products[0]?._id || "",
                  })
                }
              >
                <Button
                  size="sm"
                  variant="gooeyLeft"
                  className="w-[30%] text-[12px] md:text-sm"
                >
                  Select Product
                </Button>
              </ProductSelector>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Hero Message</Label>
            <Input
              id="message"
              value={heroSection.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Enter hero message"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={heroSection.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter hero description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="btnAction">Button Action</Label>
            <Select
              value={heroSection.btnAction}
              onValueChange={(value: "addToCart" | "buyNow") =>
                handleChange("btnAction", value)
              }
            >
              <SelectTrigger id="btnAction">
                <SelectValue placeholder="Select button action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="addToCart">Add to Cart</SelectItem>
                <SelectItem value="buyNow">Buy Now</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Display Style</Label>
            <RadioGroup
              value={heroSection.style}
              onValueChange={(value: IDisplayStyle) =>
                setHeroSection({ ...heroSection, style: value })
              }
              className="grid grid-cols-3 gap-4"
            >
              {(["one", "two", "three"] as IDisplayStyle[]).map(
                (styleOption) => (
                  <div key={styleOption}>
                    <RadioGroupItem
                      value={styleOption}
                      id={styleOption}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={styleOption}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Layout className="mb-3 h-6 w-6" />
                      <span className="capitalize">{styleOption}</span>
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Hero Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="image"
                readOnly
                value={heroSection.image}
                placeholder="Enter image URL"
              />
              <div>
                <ImageUploader onUpload={_uploadImage}>
                  <Button size="sm" className="text-[12.5px]">
                    Upload Image
                  </Button>
                </ImageUploader>
                {integration?.integration.isConnected && (
                  <Button type="button" size="sm" variant="outline">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <SaveChanges
            updates={{
              // @ts-ignore
              customizations: {
                ...store.customizations,
                hero: {
                  ...store.customizations?.hero,
                  ...heroSection,
                },
              },
            }}
            className="w-full"
          >
            Save Hero Section
          </SaveChanges>
        </div>
      </div>
    </div>
  );
};

const FooterManager: FC<{ store: Partial<IStore> }> = ({ store }) => {
  const [footer, setFooter] = useState({
    style: store.customizations?.footer.style,
    showNewsletter: store.customizations?.footer.showNewsLetter,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFooter({ style: "one", showNewsletter: false });
    setIsEditing(false);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <header>
          <h2 className="md:text-2xl text-lg font-semibold">Footer Manager</h2>
          <Text className="tracking-tight">Customize your store's footer</Text>
        </header>
        <div>
          {!footer ? (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 text-muted-foreground">
              <PackageOpen className="h-12 w-12" />
              <p>
                No footer configuration yet. Click the button below to set up
                your footer.
              </p>
            </div>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="text-sm font-medium">Footer Configuration</h2>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground capitalize">
                  Style: {footer.style}, Newsletter:{" "}
                  {footer.showNewsletter ? "Shown" : "Hidden"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        {!footer && (
          <footer>
            <Button onClick={() => setIsEditing(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Set Up Footer
            </Button>
          </footer>
        )}
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {footer ? "Edit" : "Set Up"} Footer
            </h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="style">Display Style</Label>
                <Select
                  value={footer.style}
                  onValueChange={(value: IDisplayStyle) =>
                    setFooter({ ...footer, style: value })
                  }
                >
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select display style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one">One</SelectItem>
                    <SelectItem value="two">Two</SelectItem>
                    <SelectItem value="three">Three</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="newsletter"
                  checked={footer.showNewsletter}
                  onCheckedChange={(checked) =>
                    setFooter({ ...footer, showNewsletter: checked })
                  }
                />
                <Label htmlFor="newsletter">Show Newsletter</Label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <SaveChanges
              onSave={(store) => {
                setFooter({
                  style: store.customizations?.footer.style!,
                  showNewsletter: store.customizations?.footer.showNewsLetter,
                });
                setIsEditing(false);
              }}
              updates={{
                // @ts-ignore
                customizations: {
                  ...store.customizations,
                  footer: {
                    style: footer.style!,
                    showNewsLetter: footer.showNewsletter!,
                  },
                },
              }}
              btnText="Save Footer"
              className="w-fit"
            />
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

const tabs = [
  {
    label: "Settings",
    content: StoreFrontSettings,
    path: "#settings",
  },
  {
    label: "Hero",
    content: StoreFrontHeroSection,
    path: "#hero",
  },
  {
    label: "Collections",
    content: CollectionManager,
    path: "#collections",
  },
  {
    label: "Products Page",
    content: StoreFrontProductsPage,
    path: "#products-page",
  },
  {
    label: "Product Details",
    content: StoreFrontProductPage,
    path: "#product-details",
  },
  {
    label: "Sections",
    content: StoreFrontSectionManager,
    path: "#sections",
  },
  {
    label: "Features",
    content: StoreFrontFeaturesSectionManager,
    path: "#features",
  },
  {
    label: "Footer",
    content: FooterManager,
    path: "#footer",
  },
];

function AnimatedTabs({ tabs }: AnimatedTabsProps) {
  useDocumentTitle("Customize Your Store");

  const { setCurrentStore } = useStoreBuildState();
  const location = useLocation();
  const n = useNavigate();
  const tabsRef = useRef<HTMLDivElement>(null);
  const qs = queryString.parse(location.hash) as Record<string, string>;

  const verifyTabExist = (path: string) => {
    if (!tabs.find((tab) => tab.path === path)) return "#settings";
    return path;
  };

  const key = verifyTabExist("#" + Object.keys(qs)[0]);
  const currentTab = tabs.findIndex((_) => _.path === key);

  const { isLoading, data, error } = useQuery({
    queryKey: ["store"],
    queryFn: () => storeBuilder.getStore(),
  });

  useEffect(() => {
    if (data?.data) {
      setCurrentStore(data.data);
    }
  }, [data?.data]);

  const { data: store } = data || {};

  useToastError(error);

  const page = tabs[currentTab];

  return (
    <div className="overflow-hidden md:p-3 w-full">
      <header className="p-0 relative overflow-x-auto border-b-2 w-full">
        <div ref={tabsRef} className="flex items-center gap-3 p-2">
          {tabs.map((tab, idx) => (
            <motion.div
              key={idx}
              className={cn(
                "py-2 px-4 cursor-pointer relative whitespace-nowrap",
                key === tab.path ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => n(tab.path)}
            >
              {tab.label}{" "}
              {key === tab.path && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </header>{" "}
      <div
        className={cn(
          "mt-4 p-2",
          isLoading && "flex items-center justify-center mt-10 text-slate-800"
        )}
      >
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <Loader2 size={100} className="animate-spin" />
          ) : (
            <page.content store={store || {}} key={store?._id} />
          )}{" "}
        </motion.div>{" "}
      </div>{" "}
    </div>
  );
}

const DashboardStoreFront = () => {
  const n = useNavigate();
  const { storeCode = "" } = useStoreBuildState()?.currentStore || {};
  const [isPending, startTransition] = useState(false);

  const previewStore = async () => {
    try {
      startTransition(true);
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);

      const res = await storeBuilder.editStore({
        previewFor: now.toISOString(),
      });

      n(PATHS.STORE + `${storeCode}`);

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  return (
    <div className="w-full container mx-auto p-3 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-4xl">Customization</h2>
        <Button
          disabled={isPending}
          onClick={previewStore}
          size="sm"
          variant="outline"
          className="rounded-full"
        >
          Preview
        </Button>
      </header>
      <div className="md:flex md:flex-row w-full gap-5">
        <AnimatedTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default DashboardStoreFront;
