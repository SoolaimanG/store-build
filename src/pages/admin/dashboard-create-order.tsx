import CreateOrderForm from "@/components/create-order-form";
import { ProductSelector } from "@/components/product-selector";
import { Button } from "@/components/ui/button";
import { useStoreBuildState } from "@/store";
import { useParams } from "react-router-dom";

const DashboardCreateOrder = () => {
  const { id = "" } = useParams();
  const { onProductSelect, selectedProducts } = useStoreBuildState();
  const isEditingMode = location.hash === "#edit";

  return (
    <div className="w-full container mx-auto p-4 space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold line-clamp-1">
          {isEditingMode ? "Edit" : "Create"} Order {isEditingMode && id}
        </h2>
        <ProductSelector products={selectedProducts} onSelect={onProductSelect}>
          <Button size="sm" variant="ringHover">
            Select Products
          </Button>
        </ProductSelector>
      </header>
      <CreateOrderForm id={id} isEditingMode={isEditingMode} />
    </div>
  );
};

export default DashboardCreateOrder;
