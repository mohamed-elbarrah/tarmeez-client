"use client";

import type { Config } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";
import Spacer from "./components/basic/Spacer";
import TextBlock from "./components/basic/TextBlock";
import Button from "./components/basic/Button";
import ImageBanner from "./components/basic/ImageBanner";
import Section from "./components/layout/Section";
import TwoColumns from "./components/layout/TwoColumns";
import HeroBanner from "./components/widgets/HeroBanner";
import ProductBlock from "./components/widgets/ProductBlock";
import CountdownTimer from "./components/widgets/CountdownTimer";
import { CategoriesSliderBlock } from "./components/widgets/CategoriesSliderBlock";
import { ProductsSectionBlock } from "./components/widgets/ProductsSectionBlock";

// ─────────────────────────────────────────────────────────────────────────────
// Shared field groups reused across multiple components
// ─────────────────────────────────────────────────────────────────────────────
const spacingFields = {
  paddingTop: { type: "number" as const },
  paddingBottom: { type: "number" as const },
  paddingX: { type: "number" as const },
  marginTop: { type: "number" as const },
  marginBottom: { type: "number" as const },
};

const spacingDefaults = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingX: 0,
  marginTop: 0,
  marginBottom: 0,
};

const alignField = {
  type: "radio" as const,
  options: [
    { label: "يمين", value: "right" },
    { label: "وسط", value: "center" },
    { label: "يسار", value: "left" },
  ],
};

const titleSizeField = {
  type: "select" as const,
  options: [
    { label: "كبير", value: "lg" },
    { label: "كبير جداً", value: "xl" },
    { label: "ضخم", value: "2xl" },
    { label: "ضخم جداً", value: "3xl" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript component prop types
// ─────────────────────────────────────────────────────────────────────────────
export type PageBuilderComponents = {
  Spacer: { size: "sm" | "md" | "lg" | "xl" | "custom"; customSize: number };
  TextBlock: {
    content: string;
    align: "right" | "center" | "left";
    size: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
    color: "heading" | "text" | "primary";
    fontWeight: "normal" | "medium" | "semibold" | "bold" | "black";
    lineHeight: "tight" | "normal" | "relaxed" | "loose";
    paddingTop: number;
    paddingBottom: number;
    paddingX: number;
    marginTop: number;
    marginBottom: number;
  };
  Button: {
    label: string;
    href: string;
    variant: "primary" | "outline" | "ghost";
    size: "sm" | "md" | "lg";
    align: "right" | "center" | "left" | "full";
    radius: "none" | "sm" | "md" | "lg" | "full";
    bgColor: string;
    textColor: string;
    marginTop: number;
    marginBottom: number;
  };
  ImageBanner: {
    src: string;
    alt: string;
    linkHref: string;
    height: "sm" | "md" | "lg" | "full" | "custom";
    customHeight: number;
    objectFit: "cover" | "contain";
    radius: "none" | "sm" | "md" | "lg" | "xl";
    paddingTop: number;
    paddingBottom: number;
    paddingX: number;
    marginTop: number;
    marginBottom: number;
  };
  Section: {
    backgroundColor: "transparent" | "light" | "dark" | "primary" | "custom";
    customBgColor: string;
    paddingY: "none" | "sm" | "md" | "lg" | "xl";
    paddingX: "none" | "sm" | "md" | "lg";
    maxWidth: "sm" | "md" | "lg" | "xl" | "full";
    marginTop: number;
    marginBottom: number;
  };
  TwoColumns: {
    split: "50-50" | "60-40" | "40-60" | "70-30" | "30-70";
    gap: "sm" | "md" | "lg";
    reverseOnMobile: boolean;
  };
  HeroBanner: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    backgroundColor: "primary" | "dark" | "light" | "custom";
    customBgColor: string;
    overlayOpacity: "none" | "light" | "medium" | "dark";
    textColor: "white" | "dark";
    titleSize: "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
    subtitleSize: "sm" | "base" | "lg" | "xl";
    buttonLabel: string;
    buttonHref: string;
    showButton: boolean;
    buttonRadius: "none" | "sm" | "md" | "lg" | "full";
    buttonBgColor: string;
    buttonTextColor: string;
    minHeight: "sm" | "md" | "lg" | "full";
    contentAlign: "right" | "center" | "left";
    paddingTop: number;
    paddingBottom: number;
    paddingX: number;
    marginTop: number;
    marginBottom: number;
  };
  ProductBlock: {
    productId: string;
    layout: "card" | "hero" | "minimal";
    showPrice: boolean;
    showDescription: boolean;
    showRating: boolean;
    checkoutMode: "modal" | "cart" | "both";
    buttonLabel: string;
  };
  CountdownTimer: {
    targetDate: string;
    title: string;
    expiredMessage: string;
    showDays: boolean;
    showHours: boolean;
    showMinutes: boolean;
    showSeconds: boolean;
    align: "right" | "center" | "left";
    size: "sm" | "md" | "lg";
  };
  CategoriesSliderBlock: {
    title: string;
    titleAlign: "right" | "center" | "left";
    titleSize: "lg" | "xl" | "2xl" | "3xl";
    showViewAll: boolean;
    viewAllLabel: string;
    imageRadius: "full" | "lg" | "md" | "none";
    itemsPerRow: "4" | "5" | "6" | "8";
    paddingTop: number;
    paddingBottom: number;
    paddingX: number;
    marginTop: number;
    marginBottom: number;
  };
  ProductsSectionBlock: {
    title: string;
    titleAlign: "right" | "center" | "left";
    titleSize: "lg" | "xl" | "2xl" | "3xl";
    showTitle: boolean;
    showViewAll: boolean;
    viewAllLabel: string;
    icon: "⚡" | "🔥" | "⭐" | "🎁" | "🛍️" | "none";
    iconBgColor: "red" | "primary" | "accent" | "none";
    limit: number;
    colsMobile: "1" | "2";
    colsTablet: "2" | "3" | "4";
    colsDesktop: "3" | "4" | "5" | "6";
    gap: "sm" | "md" | "lg";
    sortBy: "newest" | "popular" | "price_asc" | "price_desc";
    filterByCategory: string;
    paddingTop: number;
    paddingBottom: number;
    paddingX: number;
    marginTop: number;
    marginBottom: number;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Puck configuration
// ─────────────────────────────────────────────────────────────────────────────
export const puckConfig: Config<PageBuilderComponents> = {
  components: {
    Spacer: {
      label: "مسافة فارغة",
      fields: {
        size: {
          type: "select",
          options: [
            { label: "صغير (16px)", value: "sm" },
            { label: "متوسط (32px)", value: "md" },
            { label: "كبير (64px)", value: "lg" },
            { label: "كبير جداً (96px)", value: "xl" },
            { label: "مخصص", value: "custom" },
          ],
        },
        customSize: { type: "number" },
      },
      defaultProps: { size: "md", customSize: 40 },
      render: (props: any) => <Spacer {...props} />,
    },

    TextBlock: {
      label: "نص",
      fields: {
        content: { type: "textarea" },
        align: { ...alignField },
        size: {
          type: "select",
          options: [
            { label: "صغير", value: "sm" },
            { label: "عادي", value: "base" },
            { label: "كبير", value: "lg" },
            { label: "كبير جداً", value: "xl" },
            { label: "ضخم", value: "2xl" },
            { label: "ضخم جداً", value: "3xl" },
          ],
        },
        color: {
          type: "select",
          options: [
            { label: "عناوين", value: "heading" },
            { label: "نص عادي", value: "text" },
            { label: "أساسي", value: "primary" },
          ],
        },
        fontWeight: {
          type: "select",
          options: [
            { label: "عادي", value: "normal" },
            { label: "متوسط", value: "medium" },
            { label: "شبه عريض", value: "semibold" },
            { label: "عريض", value: "bold" },
            { label: "أسود", value: "black" },
          ],
        },
        lineHeight: {
          type: "radio",
          options: [
            { label: "ضيق", value: "tight" },
            { label: "عادي", value: "normal" },
            { label: "مريح", value: "relaxed" },
            { label: "فضفاض", value: "loose" },
          ],
        },
        ...spacingFields,
      },
      defaultProps: {
        content: "أضف نصك هنا",
        align: "right",
        size: "base",
        color: "text",
        fontWeight: "normal",
        lineHeight: "normal",
        ...spacingDefaults,
      },
      render: (props: any) => <TextBlock {...props} />,
    },

    Button: {
      label: "زر",
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "أساسي", value: "primary" },
            { label: "إطار", value: "outline" },
            { label: "بسيط", value: "ghost" },
          ],
        },
        size: {
          type: "select",
          options: [
            { label: "صغير", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
          ],
        },
        radius: {
          type: "radio",
          options: [
            { label: "بدون", value: "none" },
            { label: "خفيف", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
            { label: "دائري", value: "full" },
          ],
        },
        align: {
          type: "radio",
          options: [
            { label: "يمين", value: "right" },
            { label: "وسط", value: "center" },
            { label: "يسار", value: "left" },
            { label: "عرض كامل", value: "full" },
          ],
        },
        bgColor: { type: "text" },
        textColor: { type: "text" },
        marginTop: { type: "number" },
        marginBottom: { type: "number" },
      },
      defaultProps: {
        label: "اضغط هنا",
        href: "#",
        variant: "primary",
        size: "md",
        align: "center",
        radius: "md",
        bgColor: "",
        textColor: "",
        marginTop: 0,
        marginBottom: 0,
      },
      render: (props: any) => <Button {...props} />,
    },

    ImageBanner: {
      label: "صورة",
      fields: {
        src: { type: "text" },
        alt: { type: "text" },
        linkHref: { type: "text" },
        height: {
          type: "select",
          options: [
            { label: "صغير (192px)", value: "sm" },
            { label: "متوسط (256px)", value: "md" },
            { label: "كبير (384px)", value: "lg" },
            { label: "ملء الشاشة", value: "full" },
            { label: "مخصص", value: "custom" },
          ],
        },
        customHeight: { type: "number" },
        objectFit: {
          type: "radio",
          options: [
            { label: "تغطية", value: "cover" },
            { label: "احتواء", value: "contain" },
          ],
        },
        radius: {
          type: "select",
          options: [
            { label: "بدون", value: "none" },
            { label: "خفيف", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
            { label: "كبير جداً", value: "xl" },
          ],
        },
        ...spacingFields,
      },
      defaultProps: {
        src: "https://placehold.co/1200x400/e0f2fe/0284c7?text=Image",
        alt: "",
        linkHref: "",
        height: "md",
        customHeight: 300,
        objectFit: "cover",
        radius: "none",
        ...spacingDefaults,
      },
      render: (props: any) => <ImageBanner {...props} />,
    },

    Section: {
      label: "قسم",
      fields: {
        backgroundColor: {
          type: "select",
          options: [
            { label: "شفاف", value: "transparent" },
            { label: "فاتح", value: "light" },
            { label: "غامق", value: "dark" },
            { label: "أساسي", value: "primary" },
            { label: "مخصص", value: "custom" },
          ],
        },
        customBgColor: { type: "text" },
        paddingY: {
          type: "select",
          options: [
            { label: "بدون", value: "none" },
            { label: "صغير", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
            { label: "كبير جداً", value: "xl" },
          ],
        },
        paddingX: {
          type: "select",
          options: [
            { label: "بدون", value: "none" },
            { label: "صغير", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
          ],
        },
        maxWidth: {
          type: "select",
          options: [
            { label: "صغير", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
            { label: "كبير جداً (7xl)", value: "xl" },
            { label: "كامل العرض", value: "full" },
          ],
        },
        marginTop: { type: "number" },
        marginBottom: { type: "number" },
      },
      defaultProps: {
        backgroundColor: "transparent",
        customBgColor: "",
        paddingY: "md",
        paddingX: "sm",
        maxWidth: "xl",
        marginTop: 0,
        marginBottom: 0,
      },
      render: (props: any) => (
        <Section {...props}>
          <DropZone zone="content" />
        </Section>
      ),
    },

    TwoColumns: {
      label: "عمودان",
      fields: {
        split: {
          type: "select",
          options: [
            { label: "50 / 50", value: "50-50" },
            { label: "60 / 40", value: "60-40" },
            { label: "40 / 60", value: "40-60" },
            { label: "70 / 30", value: "70-30" },
            { label: "30 / 70", value: "30-70" },
          ],
        },
        gap: {
          type: "radio",
          options: [
            { label: "ضيق", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "واسع", value: "lg" },
          ],
        },
        reverseOnMobile: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
      },
      defaultProps: { split: "50-50", gap: "md", reverseOnMobile: true },
      render: (props: any) => (
        <TwoColumns {...props}>
          <DropZone zone="left" />
          <DropZone zone="right" />
        </TwoColumns>
      ),
    },

    HeroBanner: {
      label: "هيرو بانر",
      fields: {
        title: { type: "text" },
        titleSize: {
          type: "select",
          options: [
            { label: "كبير", value: "xl" },
            { label: "أكبر", value: "2xl" },
            { label: "ضخم", value: "3xl" },
            { label: "ضخم جداً", value: "4xl" },
            { label: "عملاق", value: "5xl" },
            { label: "عملاق جداً", value: "6xl" },
          ],
        },
        subtitle: { type: "textarea" },
        subtitleSize: {
          type: "radio",
          options: [
            { label: "صغير", value: "sm" },
            { label: "عادي", value: "base" },
            { label: "كبير", value: "lg" },
            { label: "كبير جداً", value: "xl" },
          ],
        },
        contentAlign: { ...alignField },
        backgroundImage: { type: "text" },
        backgroundColor: {
          type: "select",
          options: [
            { label: "أساسي", value: "primary" },
            { label: "غامق", value: "dark" },
            { label: "فاتح", value: "light" },
            { label: "مخصص", value: "custom" },
          ],
        },
        customBgColor: { type: "text" },
        overlayOpacity: {
          type: "select",
          options: [
            { label: "بدون", value: "none" },
            { label: "خفيف", value: "light" },
            { label: "متوسط", value: "medium" },
            { label: "عالي", value: "dark" },
          ],
        },
        textColor: {
          type: "radio",
          options: [
            { label: "أبيض", value: "white" },
            { label: "غامق", value: "dark" },
          ],
        },
        minHeight: {
          type: "select",
          options: [
            { label: "صغير", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
            { label: "ملء الشاشة", value: "full" },
          ],
        },
        showButton: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        buttonLabel: { type: "text" },
        buttonHref: { type: "text" },
        buttonRadius: {
          type: "radio",
          options: [
            { label: "بدون", value: "none" },
            { label: "خفيف", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
            { label: "دائري", value: "full" },
          ],
        },
        buttonBgColor: { type: "text" },
        buttonTextColor: { type: "text" },
        ...spacingFields,
      },
      defaultProps: {
        title: "عنوان رئيسي جذاب",
        titleSize: "4xl",
        subtitle: "وصف مختصر يشرح ما تقدمه",
        subtitleSize: "lg",
        contentAlign: "center",
        backgroundImage:
          "https://placehold.co/1400x600/0f172a/ffffff?text=Hero",
        backgroundColor: "dark",
        customBgColor: "",
        overlayOpacity: "medium",
        textColor: "white",
        minHeight: "md",
        showButton: true,
        buttonLabel: "اكتشف الآن",
        buttonHref: "#",
        buttonRadius: "full",
        buttonBgColor: "",
        buttonTextColor: "",
        ...spacingDefaults,
      },
      render: (props: any) => <HeroBanner {...props} />,
    },

    ProductBlock: {
      label: "بلوك منتج",
      fields: {
        productId: { type: "text" },
        layout: {
          type: "select",
          options: [
            { label: "بطاقة عرض", value: "card" },
            { label: "هيرو", value: "hero" },
            { label: "بسيط", value: "minimal" },
          ],
        },
        showPrice: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        showDescription: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        showRating: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        checkoutMode: {
          type: "select",
          options: [
            { label: "شراء سريع (مودال)", value: "modal" },
            { label: "إضافة للسلة", value: "cart" },
            { label: "كلاهما", value: "both" },
          ],
        },
        buttonLabel: { type: "text" },
      },
      defaultProps: {
        productId: "",
        layout: "card",
        showPrice: true,
        showDescription: true,
        showRating: true,
        checkoutMode: "both",
        buttonLabel: "اشتري الآن",
      },
      render: (props: any) => <ProductBlock {...props} />,
    },

    CountdownTimer: {
      label: "عداد تنازلي",
      fields: {
        title: { type: "text" },
        targetDate: { type: "text" },
        expiredMessage: { type: "text" },
        showDays: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        showHours: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        showMinutes: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        showSeconds: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        align: { ...alignField },
        size: {
          type: "select",
          options: [
            { label: "صغير", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "كبير", value: "lg" },
          ],
        },
      },
      defaultProps: {
        targetDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        title: "ينتهي العرض خلال",
        expiredMessage: "انتهى العرض",
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        align: "center",
        size: "md",
      },
      render: (props: any) => <CountdownTimer {...props} />,
    },

    CategoriesSliderBlock: {
      label: "شريط الفئات",
      fields: {
        title: { type: "text" },
        titleAlign: { ...alignField },
        titleSize: { ...titleSizeField },
        showViewAll: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        viewAllLabel: { type: "text" },
        imageRadius: {
          type: "radio",
          options: [
            { label: "دائري", value: "full" },
            { label: "مدور كبير", value: "lg" },
            { label: "مدور", value: "md" },
            { label: "مربع", value: "none" },
          ],
        },
        itemsPerRow: {
          type: "select",
          options: [
            { label: "4 عناصر", value: "4" },
            { label: "5 عناصر", value: "5" },
            { label: "6 عناصر", value: "6" },
            { label: "8 عناصر", value: "8" },
          ],
        },
        ...spacingFields,
      },
      defaultProps: {
        title: "تسوق حسب الفئة",
        titleAlign: "right",
        titleSize: "2xl",
        showViewAll: true,
        viewAllLabel: "عرض الكل",
        imageRadius: "full",
        itemsPerRow: "6",
        ...spacingDefaults,
      },
      render: (props: any) => <CategoriesSliderBlock {...props} />,
    },

    ProductsSectionBlock: {
      label: "قسم المنتجات",
      fields: {
        title: { type: "text" },
        titleAlign: { ...alignField },
        titleSize: { ...titleSizeField },
        showTitle: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        showViewAll: {
          type: "radio",
          options: [
            { label: "نعم", value: true as any },
            { label: "لا", value: false as any },
          ],
        },
        viewAllLabel: { type: "text" },
        icon: {
          type: "select",
          options: [
            { label: "⚡ برق", value: "⚡" },
            { label: "🔥 نار", value: "🔥" },
            { label: "⭐ نجمة", value: "⭐" },
            { label: "🎁 هدية", value: "🎁" },
            { label: "🛍️ تسوق", value: "🛍️" },
            { label: "بدون أيقونة", value: "none" },
          ],
        },
        iconBgColor: {
          type: "select",
          options: [
            { label: "أحمر", value: "red" },
            { label: "لون أساسي", value: "primary" },
            { label: "لون مميز", value: "accent" },
            { label: "بدون خلفية", value: "none" },
          ],
        },
        limit: { type: "number" },
        colsMobile: {
          type: "radio",
          options: [
            { label: "عمود", value: "1" },
            { label: "عمودان", value: "2" },
          ],
        },
        colsTablet: {
          type: "select",
          options: [
            { label: "2 أعمدة", value: "2" },
            { label: "3 أعمدة", value: "3" },
            { label: "4 أعمدة", value: "4" },
          ],
        },
        colsDesktop: {
          type: "select",
          options: [
            { label: "3 أعمدة", value: "3" },
            { label: "4 أعمدة", value: "4" },
            { label: "5 أعمدة", value: "5" },
            { label: "6 أعمدة", value: "6" },
          ],
        },
        gap: {
          type: "radio",
          options: [
            { label: "ضيق", value: "sm" },
            { label: "متوسط", value: "md" },
            { label: "واسع", value: "lg" },
          ],
        },
        sortBy: {
          type: "select",
          options: [
            { label: "الأحدث", value: "newest" },
            { label: "الأكثر مبيعاً", value: "popular" },
            { label: "السعر (تصاعدي)", value: "price_asc" },
            { label: "السعر (تنازلي)", value: "price_desc" },
          ],
        },
        filterByCategory: { type: "text" },
        ...spacingFields,
      },
      defaultProps: {
        title: "عروض حصرية",
        titleAlign: "right",
        titleSize: "2xl",
        showTitle: true,
        showViewAll: true,
        viewAllLabel: "عرض المزيد",
        icon: "⚡",
        iconBgColor: "red",
        limit: 5,
        colsMobile: "2",
        colsTablet: "3",
        colsDesktop: "5",
        gap: "sm",
        sortBy: "newest",
        filterByCategory: "",
        ...spacingDefaults,
      },
      render: (props: any) => <ProductsSectionBlock {...props} />,
    },
  },

  categories: {
    widgets: {
      title: "قطع الودجت",
      components: [
        "HeroBanner",
        "ProductBlock",
        "CountdownTimer",
        "CategoriesSliderBlock",
        "ProductsSectionBlock",
      ],
    },
    layout: {
      title: "تنسيقات الصفحة",
      components: ["Section", "TwoColumns"],
    },
    basic: {
      title: "عناصر بسيطة",
      components: ["Spacer", "TextBlock", "Button", "ImageBanner"],
    },
  },
};

export default puckConfig;
