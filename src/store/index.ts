import { IUser, IUseStoreBuildTypes } from "@/types";
import { create } from "zustand";

export const useStoreBuildState = create<IUseStoreBuildTypes>((set) => ({
  // Getters
  user: null,
  isPaymentConfirmed: false,
  openAddPaymentDetailsModal: false,
  selectedProducts: [],
  onProductSelect(products) {
    set((state) => ({
      ...state,
      selectedProducts: products,
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
  openOTPValidator: {
    open: false,
    otpFor: "login",
  },
  setOpenAddPaymentDetailsModal(openAddPaymentDetailsModal) {
    set((state) => ({
      ...state,
      openAddPaymentDetailsModal,
    }));
  },
  //Setters
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
}));
