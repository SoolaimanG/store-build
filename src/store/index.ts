import { IUser, IUseStoreBuildTypes } from "@/types";
import { create } from "zustand";

export const useStoreBuildState = create<IUseStoreBuildTypes>((set) => ({
  // Getters
  user: null,
  isPaymentConfirmed: false,
  openAddPaymentDetailsModal: false,
  selectedProducts: [],
  currentStore: undefined,
  openOTPValidator: {
    open: false,
    otpFor: "login",
  },
  //Setters
  onProductSelect(products) {
    set((state) => ({
      ...state,
      selectedProducts: products.map((p) => ({
        ...p,
        quantity: 1,
      })),
    }));
  },
  setIsPaymentDetailsConfirmed: () => {
    set((state) => ({
      ...state,
      isConfirmed:
        state.user?.paymentDetails?.accountName &&
        state.user?.paymentDetails?.accountNumber &&
        state.user.paymentDetails?.bankName, // Update the state here
    }));
  },
  setOpenAddPaymentDetailsModal(openAddPaymentDetailsModal) {
    set((state) => ({
      ...state,
      openAddPaymentDetailsModal,
    }));
  },
  setOpenOTPValidator: (openOTPValidator) => {
    set((state) => ({
      ...state,
      openOTPValidator,
    }));
  },
  setUser(props) {
    set((state) => ({
      ...state,
      user: { ...props, ...(state.user as IUser) },
    }));
  },
  removeProduct(productId) {
    set((state) => ({
      ...state,
      selectedProducts: state.selectedProducts.filter(
        (product) => product._id !== productId
      ),
    }));
  },
  setCurrentStore(currentStore) {
    set((state) => ({
      ...state,
      currentStore,
    }));
  },
  setOrderPlaced(order) {
    set((state) => ({
      ...state,
      orderPlaced: order,
    }));
  },
  adjustProductQuantity(id, type) {
    set((state) => ({
      ...state,
      selectedProducts: state.selectedProducts.map((p) =>
        p._id === id
          ? {
              ...p,
              quantity:
                (type === "dec"
                  ? Math.max(1, p.quantity - 1)
                  : Math.min(p.maxStock, p.quantity + 1)) || 1,
            }
          : { ...p }
      ),
    }));
  },
}));
