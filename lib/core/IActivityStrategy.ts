import { StoreProduct } from "@/lib/themes/types";

export interface IActivityStrategy {
  getPrimaryActionLabel(): string;
  getPricingDisplay(product: StoreProduct): string;
  resolveActivityIcon(): string;
  formatProductUrl(storeSlug: string, product: StoreProduct): string;

  getProgressBarPercent(product: StoreProduct): number | undefined;
  getProgressMessage(product: StoreProduct): string | undefined;
  getGoalDisplay(product: StoreProduct): string | undefined;
  getCollectedDisplay(product: StoreProduct): string | undefined;

  getFloatingBadgeText(product: StoreProduct): string | undefined;

  // Donation Specifics
  shouldShowAmountInput(): boolean;
  getDonationPresets(product: StoreProduct): number[] | undefined;
  getDonationLabels(product: StoreProduct): Record<string, string> | undefined;
  getAllowCustomAmount(product: StoreProduct): boolean;
  getBadgeText(product: StoreProduct): string | undefined;
}
