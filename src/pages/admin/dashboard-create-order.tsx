import CreateOrderForm from "@/components/create-order-form";
import { ProductSelector } from "@/components/product-selector";
import { Button } from "@/components/ui/button";
import { useStoreBuildState } from "@/store";

const DashboardCreateOrder = () => {
  const { onProductSelect, selectedProducts } = useStoreBuildState();

  return (
    <div className="w-full container mx-auto p-4 space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Create Order</h2>
        <ProductSelector products={selectedProducts} onSelect={onProductSelect}>
          <Button size="sm" variant="ringHover">
            Select Products
          </Button>
        </ProductSelector>
      </header>
      <CreateOrderForm />
    </div>
  );
};

export default DashboardCreateOrder;
