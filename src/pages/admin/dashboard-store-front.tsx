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
  PackageOpen,
  Plus,
  RocketIcon,
  Sparkles,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn, getInitials } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
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
  IStoreFeatureProps,
  IStoreFeatures,
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface Tab {
  label: string;
  content: React.ReactNode;
  path: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
}

const themes = [
  { name: "Modern Purple", primary: "#8B5CF6", secondary: "#C4B5FD" },
  { name: "Ocean Blue", primary: "#3B82F6", secondary: "#93C5FD" },
  { name: "Forest Green", primary: "#10B981", secondary: "#6EE7B7" },
  { name: "Sunset Orange", primary: "#F97316", secondary: "#FDBA74" },
  { name: "Berry Red", primary: "#EF4444", secondary: "#FCA5A5" },
];

const StoreFrontSettings = () => {
  const [profilePicture, setProfilePicture] = useState("/placeholder.svg");
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    }
  };
  return (
    <section>
      <h2 className="text-2xl font-semibold">Store Settings</h2>
      <form className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative w-32 h-32 rounded-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Avatar className="w-full h-full object-cover">
              <AvatarImage src={profilePicture} alt="Store Logo" />
              <AvatarFallback>
                {getInitials("Soolaiman Abuabakar")}
              </AvatarFallback>
            </Avatar>

            {isHovered && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                    <p className="text-sm">Update Logo</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="upload">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                      <TabsTrigger value="url">URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                      <div className="flex flex-col items-center">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mb-2"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Choose File
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="url">
                      <div className="flex flex-col items-center">
                        <Input
                          type="url"
                          placeholder="Enter image URL"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="mb-2"
                        />
                        <Button type="button" onClick={handleUrlSubmit}>
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
          <Switch />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input id="storeName" placeholder="Enter your store name" />
        </div>

        <div className="space-y-2">
          <Label>About Us</Label>
          <TextEditor />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter a short description of your store"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>

          <div className="flex items-center gap-4 flex-wrap">
            {themes.map((theme, idx) => (
              <div key={idx} onClick={() => setSelectedTheme(theme.name)}>
                <div className="flex items-center">
                  <div className="flex cursor-pointer w-full relative">
                    {theme.name === selectedTheme && (
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
        <Button className="w-full">Save</Button>
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

function StoreFrontProductsPage() {
  const [customizations, setCustomizations] =
    useState<ProductPageCustomizations>({
      canFilter: true,
      canSearch: true,
      sort: ["price", "name"],
      havePagination: true,
    });

  const sortOptions: ISortBy[] = ["price", "name", "date"];

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

  const handleSubmit = () => {
    console.log("Submitting customizations:", customizations);
    // Here you would typically send this data to your backend or state management system
  };

  return (
    <div className="w-full space-y-5">
      <header>
        <h2 className="text-xl font-semibold">Product Page Customizations</h2>
        <Text>Tailor your product page to perfection</Text>
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
        <Button onClick={handleSubmit} className="w-full">
          Save
        </Button>
      </div>
    </div>
  );
}

function StoreFrontProductPage() {
  const [style, setStyle] = useState<IProductPage>({
    showSimilarProducts: true,
    style: "one",
    showReviews: true,
  });

  const handleToggle = (key: keyof IProductPage) => {
    setStyle((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStyleChange = (newStyle: IDisplayStyle) => {
    setStyle((prev) => ({ ...prev, style: newStyle }));
  };

  const handleSubmit = () => {
    console.log("Submitting product page style:", style);
    // Here you would typically send this data to your backend or state management system
  };

  return (
    <div className="w-full space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">
          Product Page Style Customizer
        </h2>
        <Text>Customize the layout and features of your product pages</Text>
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
          <Badge variant="outline" className="rounded-sm border-2">
            Display Style: {style.style}
          </Badge>
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Save
        </Button>
      </footer>
    </div>
  );
}

function StoreFrontSectionManager() {
  const [sections, setSections] = useState<ISection[]>([]);
  const [editingSection, setEditingSection] = useState<ISection | null>(null);

  const handleAddSection = () => {
    const newSection: ISection = {
      _id: Date.now().toString(),
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

  const handleSaveSection = (updatedSection: ISection) => {
    setSections(
      sections.map((section) =>
        section._id === updatedSection._id ? updatedSection : section
      )
    );
    setEditingSection(null);
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
              {sections.map((section) => (
                <Card key={section._id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h2 className="text-sm font-medium">
                      {section.header || "Untitled Section"}
                    </h2>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditSection(section)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSection(section._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
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

      {editingSection && (
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
            <Button onClick={() => handleSaveSection(editingSection)}>
              Save Section
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

function StoreFrontFeaturesSectionManager() {
  const [featuresSection, setFeaturesSection] = useState<IStoreFeatureProps>({
    showFeatures: true,
    features: [],
    style: "one",
  });
  const [editingFeature, setEditingFeature] = useState<IStoreFeatures | null>(
    null
  );

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
      _id: Date.now().toString(),
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

  const handleDeleteFeature = (id: string) => {
    setFeaturesSection((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature._id !== id),
    }));
    if (editingFeature?._id === id) {
      setEditingFeature(null);
    }
  };

  const handleSaveFeature = (updatedFeature: IStoreFeatures) => {
    setFeaturesSection((prev) => ({
      ...prev,
      features: prev.features.map((feature) =>
        feature._id === updatedFeature._id ? updatedFeature : feature
      ),
    }));
    setEditingFeature(null);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <header>
          <h2 className="text-2xl font-semibold">Features Section Manager</h2>
          <Text>Manage the features section of your store</Text>
        </header>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-features">Show Features Section</Label>
            <Switch
              id="show-features"
              checked={featuresSection.showFeatures}
              onCheckedChange={handleToggleFeatures}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-style">Section Display Style</Label>
            <Select
              value={featuresSection.style}
              onValueChange={(value: IDisplayStyle) => handleStyleChange(value)}
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
                <Card key={feature._id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h2 className="text-sm font-medium">
                      {feature.header || "Untitled Feature"}
                    </h2>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditFeature(feature)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFeature(feature._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground truncate">
                      {feature.description}
                    </p>
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

      {editingFeature && (
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
                  <Button type="button" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingFeature(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveFeature(editingFeature)}>
              Save Feature
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

const tabs = [
  {
    label: "Settings",
    content: <StoreFrontSettings />,
    path: "#settings",
  },
  {
    label: "Collections",
    content: <CollectionManager />,
    path: "#collections",
  },
  {
    label: "Products Page",
    content: <StoreFrontProductsPage />,
    path: "#products-page",
  },
  {
    label: "Product Details",
    content: <StoreFrontProductPage />,
    path: "#product-details",
  },
  {
    label: "Sections",
    content: <StoreFrontSectionManager />,
    path: "#sections",
  },
  {
    label: "Features",
    content: <StoreFrontFeaturesSectionManager />,
    path: "#features",
  },
  {
    label: "Footer",
    content: <div>API settings content</div>,
    path: "#footer",
  },
];

function AnimatedTabs({ tabs }: AnimatedTabsProps) {
  const location = useLocation();
  const n = useNavigate();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const qs = queryString.parse(location.hash) as Record<string, string>;

  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      const handleScroll = () => {
        setShowLeftArrow(tabsElement.scrollLeft > 0);
        setShowRightArrow(
          tabsElement.scrollLeft <
            tabsElement.scrollWidth - tabsElement.clientWidth
        );
      };

      tabsElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial state

      return () => tabsElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      const scrollAmount = tabsElement.clientWidth / 2;
      tabsElement.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const verifyTabExist = (path: string) => {
    if (!tabs.find((tab) => tab.path === path)) return "#settings";
    return path;
  };

  const key = verifyTabExist("#" + Object.keys(qs)[0]);
  const currentTab = tabs.findIndex((_) => _.path === key);

  return (
    <Card className="overflow-hidden p-0">
      <CardHeader className="p-0 relative">
        {showLeftArrow && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 p-2 z-10"
            onClick={() => scrollTabs("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {showRightArrow && (
          <Button
            variant="secondary"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 z-10"
            onClick={() => scrollTabs("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
        <div
          ref={tabsRef}
          className="flex scrollbar-hide items-center gap-3 p-2"
        >
          {tabs.map((tab, idx) => (
            <motion.div
              key={idx}
              className={cn(
                "py-2 px-4 cursor-pointer relative whitespace-nowrap",
                key === tab.path ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => n(tab.path)}
            >
              {tab.label}
              {key === tab.path && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <ScrollArea className="h-[30rem]">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs[currentTab].content}
          </motion.div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

const DashboardStoreFront = () => {
  return (
    <div className="w-full container mx-auto p-3 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Store Front Customization</h2>
        <Button size="sm" variant="shine" className="gap-2">
          <RocketIcon size={19} />
          Publish
        </Button>
      </header>
      <div className="md:flex md:flex-row w-full gap-5">
        <div className="basis-[65%]">
          <AnimatedTabs tabs={tabs} />
        </div>

        <div className="hidden md:basis-[35%] md:flex">
          <StorePreview />
        </div>
      </div>
    </div>
  );
};

const StorePreview = () => {
  return <div>Store Preview</div>;
};

export default DashboardStoreFront;
