import { useStoreBuildState } from "@/store";

export const useLogic = () => {
  const { user } = useStoreBuildState();
  const isPremiumUser = user?.plan.type === "premium";

  return { isPremiumUser };
};
