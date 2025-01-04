import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EditCustomerInfo } from "./edit-customer-info";
import { EditDelivery } from "./edit-delivery";
import { EditShipping } from "./edit-shipping";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string | null;
  isDesktop: boolean;
  orderData: any; // Replace 'any' with the correct type for your order data
}

export function EditModal({
  isOpen,
  onClose,
  section,
  isDesktop,
  orderData,
}: EditModalProps) {
  const ModalComponent = isDesktop ? Dialog : Drawer;
  const ContentComponent = isDesktop ? DialogContent : DrawerContent;
  const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;

  let EditComponent;
  let title;

  switch (section) {
    case "customer":
      EditComponent = EditCustomerInfo;
      title = "Edit Customer Info";
      break;
    case "delivery":
      EditComponent = EditDelivery;
      title = "Edit Delivery";
      break;
    case "shipping":
      EditComponent = EditShipping;
      title = "Edit Shipping";
      break;
    default:
      return null;
  }

  return (
    <ModalComponent open={isOpen} onOpenChange={onClose}>
      <ContentComponent>
        <HeaderComponent>
          <TitleComponent>{title}</TitleComponent>
        </HeaderComponent>
        {EditComponent && (
          <EditComponent orderData={orderData} onClose={onClose} />
        )}
      </ContentComponent>
    </ModalComponent>
  );
}
