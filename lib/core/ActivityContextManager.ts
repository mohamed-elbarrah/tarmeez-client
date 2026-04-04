import { StoreProduct } from "@/lib/themes/types";
import { IActivityStrategy } from "./IActivityStrategy";

class RetailStrategy implements IActivityStrategy {
  getPrimaryActionLabel(): string {
    return "إضافة للسلة";
  }

  getPricingDisplay(product: StoreProduct): string {
    return `${product.price.toLocaleString()} ر.س`;
  }

  resolveActivityIcon(): string {
    return "⚡";
  }

  formatProductUrl(storeSlug: string, product: StoreProduct): string {
    return `/store/${storeSlug}/product/${encodeURIComponent(product.slug || product.id)}`;
  }

  getProgressBarPercent(product: StoreProduct): number | undefined {
    return undefined;
  }

  getProgressMessage(product: StoreProduct): string | undefined {
    return undefined;
  }

  getGoalDisplay(product: StoreProduct): string | undefined {
    return undefined;
  }

  getCollectedDisplay(product: StoreProduct): string | undefined {
    return undefined;
  }

  getFloatingBadgeText(product: StoreProduct): string | undefined {
    return product.discount ? `خصم ${product.discount}` : undefined;
  }

  shouldShowAmountInput(): boolean {
    return false;
  }

  getDonationPresets(product: StoreProduct): number[] | undefined {
    return undefined;
  }

  getDonationLabels(product: StoreProduct): Record<string, string> | undefined {
    return undefined;
  }

  getAllowCustomAmount(product: StoreProduct): boolean {
    return false;
  }

  getBadgeText(product: StoreProduct): string | undefined {
    return undefined;
  }
}

class CharityStrategy implements IActivityStrategy {
  getPrimaryActionLabel(): string {
    return "تبرع الآن";
  }

  getPricingDisplay(product: StoreProduct): string {
    return `${product.price.toLocaleString("en-US")} ر.س`;
  }

  resolveActivityIcon(): string {
    return "💚";
  }

  formatProductUrl(storeSlug: string, product: StoreProduct): string {
    return `/store/${storeSlug}/product/${encodeURIComponent(product.slug || product.id)}`;
  }

  getProgressBarPercent(product: StoreProduct): number | undefined {
    const dm = product.donationMetadata;
    if (!dm?.targetAmount || dm.targetAmount <= 0) return 0;
    return Math.min(
      Math.round(((dm.currentAmount ?? 0) / dm.targetAmount) * 100),
      100,
    );
  }

  getProgressMessage(product: StoreProduct): string | undefined {
    const dm = product.donationMetadata;
    const percent = this.getProgressBarPercent(product) || 0;

    if (percent === 0) return dm?.progressMessages?.["0"] || "كن أول مبادر";
    if (dm?.progressMessages?.[percent.toString()]) {
      return dm.progressMessages[percent.toString()];
    }
    if (percent >= 100) return "مكتمل ✓";
    return `${percent}% تم جمعه`;
  }

  getFloatingBadgeText(product: StoreProduct): string | undefined {
    return undefined;
  }

  shouldShowAmountInput(): boolean {
    return true;
  }

  getGoalDisplay(product: StoreProduct): string | undefined {
    const dm = product.donationMetadata;
    return dm?.targetAmount
      ? `${dm.targetAmount.toLocaleString("en-US")} ر.س`
      : undefined;
  }

  getCollectedDisplay(product: StoreProduct): string | undefined {
    const dm = product.donationMetadata;
    return dm?.currentAmount !== undefined
      ? `${dm.currentAmount.toLocaleString("en-US")} ر.س`
      : undefined;
  }

  getDonationPresets(product: StoreProduct): number[] | undefined {
    return product.donationMetadata?.donationOptions || [10, 50, 100];
  }

  getDonationLabels(product: StoreProduct): Record<string, string> | undefined {
    return product.donationMetadata?.donationLabels;
  }

  getAllowCustomAmount(product: StoreProduct): boolean {
    return product.donationMetadata?.allowCustomAmount ?? true;
  }

  getBadgeText(product: StoreProduct): string | undefined {
    return product.category || undefined;
  }
}

export class ActivityContextManager {
  private strategy: IActivityStrategy;

  constructor(type: "RETAIL" | "CHARITY" = "RETAIL") {
    this.strategy =
      type === "CHARITY" ? new CharityStrategy() : new RetailStrategy();
  }

  getPrimaryActionLabel(): string {
    return this.strategy.getPrimaryActionLabel();
  }

  getPricingDisplay(product: StoreProduct): string {
    return this.strategy.getPricingDisplay(product);
  }

  resolveActivityIcon(): string {
    return this.strategy.resolveActivityIcon();
  }

  formatProductUrl(storeSlug: string, product: StoreProduct): string {
    return this.strategy.formatProductUrl(storeSlug, product);
  }

  getProgressBarPercent(product: StoreProduct): number | undefined {
    return this.strategy.getProgressBarPercent(product);
  }

  getProgressMessage(product: StoreProduct): string | undefined {
    return this.strategy.getProgressMessage(product);
  }

  getFloatingBadgeText(product: StoreProduct): string | undefined {
    return this.strategy.getFloatingBadgeText(product);
  }

  shouldShowAmountInput(): boolean {
    return this.strategy.shouldShowAmountInput();
  }

  getGoalDisplay(product: StoreProduct): string | undefined {
    return this.strategy.getGoalDisplay(product);
  }

  getCollectedDisplay(product: StoreProduct): string | undefined {
    return this.strategy.getCollectedDisplay(product);
  }

  getDonationPresets(product: StoreProduct): number[] | undefined {
    return this.strategy.getDonationPresets(product);
  }

  getDonationLabels(product: StoreProduct): Record<string, string> | undefined {
    return this.strategy.getDonationLabels(product);
  }

  getAllowCustomAmount(product: StoreProduct): boolean {
    return this.strategy.getAllowCustomAmount(product);
  }

  getBadgeText(product: StoreProduct): string | undefined {
    return this.strategy.getBadgeText(product);
  }
}
