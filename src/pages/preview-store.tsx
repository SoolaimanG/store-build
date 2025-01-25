import { doesAllCategoriesHasImage, storeBuilder } from "@/lib/utils";
import { useStoreBuildState } from "@/store";
import HeroSection from "@/store/hero";
import StoreSections from "@/store/sections";
import StoreCategories from "@/store/store-categories";
import {
  StoreFeaturesOne,
  StoreFeaturesTwo,
  StoreFeatureThree,
} from "@/store/store-features";
import { IDisplayStyle, IStoreFeatureProps } from "@/types";
import { useQuery } from "@tanstack/react-query";

const PreviewStore = () => {
  const { currentStore } = useStoreBuildState();
  const { _id = "", customizations } = currentStore || {};

  const { isLoading: categoriesLoading, data: _data } = useQuery({
    queryKey: ["categories", _id],
    queryFn: () => storeBuilder.getCategories(_id),
    enabled: Boolean(_id),
  });

  const { data: categories = [] } = _data || {};

  const featureDisplay: Record<IDisplayStyle, any> = {
    one: (
      <StoreFeaturesOne {...(customizations?.features as IStoreFeatureProps)} />
    ),
    two: (
      <StoreFeaturesTwo {...(customizations?.features as IStoreFeatureProps)} />
    ),
    three: (
      <StoreFeatureThree
        {...(customizations?.features as IStoreFeatureProps)}
      />
    ),
  };

  return (
    <div>
      <HeroSection />
      {doesAllCategoriesHasImage(categories) && (
        <StoreCategories
          isLoading={categoriesLoading}
          categories={categories}
        />
      )}
      <StoreSections />
      {customizations?.features.showFeatures &&
        featureDisplay[customizations?.features.style || ""]}
    </div>
  );
};

export default PreviewStore;
