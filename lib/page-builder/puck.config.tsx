'use client';

import type { Config } from '@puckeditor/core';
import Spacer from './components/basic/Spacer';
import TextBlock from './components/basic/TextBlock';
import Button from './components/basic/Button';
import ImageBanner from './components/basic/ImageBanner';
import Section from './components/layout/Section';
import TwoColumns from './components/layout/TwoColumns';
import HeroBanner from './components/widgets/HeroBanner';
import ProductBlock from './components/widgets/ProductBlock';
import CountdownTimer from './components/widgets/CountdownTimer';

export type PageBuilderComponents = {
  Spacer: {
    size: 'sm' | 'md' | 'lg' | 'xl';
  };
  TextBlock: {
    content: string;
    align: 'right' | 'center' | 'left';
    size: 'sm' | 'base' | 'lg' | 'xl';
    color: 'heading' | 'text' | 'primary';
  };
  Button: {
    label: string;
    href: string;
    variant: 'primary' | 'outline' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    align: 'right' | 'center' | 'left' | 'full';
  };
  ImageBanner: {
    src: string;
    alt: string;
    height: 'sm' | 'md' | 'lg' | 'full';
    objectFit: 'cover' | 'contain';
    radius: 'none' | 'sm' | 'lg';
  };
  Section: {
    backgroundColor: 'transparent' | 'light' | 'dark' | 'primary';
    paddingY: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    maxWidth: 'sm' | 'md' | 'lg' | 'full';
  };
  TwoColumns: {
    split: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
    gap: 'sm' | 'md' | 'lg';
    reverseOnMobile: boolean;
  };
  HeroBanner: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    backgroundColor: 'primary' | 'dark' | 'light' | 'custom';
    overlayOpacity: 'none' | 'light' | 'medium' | 'dark';
    textColor: 'white' | 'dark';
    buttonLabel: string;
    buttonHref: string;
    showButton: boolean;
    minHeight: 'sm' | 'md' | 'lg' | 'full';
    contentAlign: 'right' | 'center' | 'left';
  };
  ProductBlock: {
    productId: string;
    layout: 'card' | 'hero' | 'minimal';
    showPrice: boolean;
    showDescription: boolean;
    showRating: boolean;
    checkoutMode: 'modal' | 'cart' | 'both';
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
    align: 'right' | 'center' | 'left';
    size: 'sm' | 'md' | 'lg';
  };
};

export const puckConfig: Config<PageBuilderComponents> = {
  components: {
    Spacer: {
      label: 'مسافة فارغة',
      fields: {
        size: {
          type: 'select',
          options: [
            { label: 'صغير', value: 'sm' },
            { label: 'متوسط', value: 'md' },
            { label: 'كبير', value: 'lg' },
            { label: 'كبير جداً', value: 'xl' },
          ],
        },
      },
      defaultProps: {
        size: 'md',
      },
      render: (props: any) => <Spacer {...props} />,
    },
    TextBlock: {
      label: 'نص',
      fields: {
        content: { type: 'textarea' },
        align: {
          type: 'radio',
          options: [
            { label: 'يمين', value: 'right' },
            { label: 'وسط', value: 'center' },
            { label: 'يسار', value: 'left' },
          ],
        },
        size: {
          type: 'select',
          options: [
            { label: 'صغير', value: 'sm' },
            { label: 'عادي', value: 'base' },
            { label: 'كبير', value: 'lg' },
            { label: 'كبير جداً', value: 'xl' },
          ],
        },
        color: {
          type: 'select',
          options: [
            { label: 'عناوين', value: 'heading' },
            { label: 'نص عادي', value: 'text' },
            { label: 'أساسي', value: 'primary' },
          ],
        },
      },
      defaultProps: {
        content: 'أضف نصك هنا',
        align: 'right',
        size: 'base',
        color: 'text',
      },
      render: (props: any) => <TextBlock {...props} />,
    },
    Button: {
      label: 'زر',
      fields: {
        label: { type: 'text' },
        href: { type: 'text' },
        variant: {
          type: 'select',
          options: [
            { label: 'أساسي', value: 'primary' },
            { label: 'إطار', value: 'outline' },
            { label: 'بسيط', value: 'ghost' },
          ],
        },
        size: {
          type: 'select',
          options: [
            { label: 'صغير', value: 'sm' },
            { label: 'متوسط', value: 'md' },
            { label: 'كبير', value: 'lg' },
          ],
        },
        align: {
          type: 'radio',
          options: [
            { label: 'يمين', value: 'right' },
            { label: 'وسط', value: 'center' },
            { label: 'يسار', value: 'left' },
            { label: 'عرض كامل', value: 'full' },
          ],
        },
      },
      defaultProps: {
        label: 'اضغط هنا',
        href: '#',
        variant: 'primary',
        size: 'md',
        align: 'center',
      },
      render: (props: any) => <Button {...props} />,
    },
    ImageBanner: {
      label: 'صورة',
      fields: {
        src: { type: 'text' },
        alt: { type: 'text' },
        height: {
          type: 'select',
          options: [
            { label: 'صغير', value: 'sm' },
            { label: 'متوسط', value: 'md' },
            { label: 'كبير', value: 'lg' },
            { label: 'ملء الشاشة', value: 'full' },
          ],
        },
        objectFit: {
          type: 'radio',
          options: [
            { label: 'تغطية', value: 'cover' },
            { label: 'احتواء', value: 'contain' },
          ],
        },
        radius: {
          type: 'radio',
          options: [
            { label: 'بدون', value: 'none' },
            { label: 'خفيف', value: 'sm' },
            { label: 'كبير', value: 'lg' },
          ],
        },
      },
      defaultProps: {
        src: 'https://placehold.co/1200x400/e0f2fe/0284c7?text=Image',
        alt: '',
        height: 'md',
        objectFit: 'cover',
        radius: 'none',
      },
      render: (props: any) => <ImageBanner {...props} />,
    },
    Section: {
      label: 'قسم',
      fields: {
        backgroundColor: {
          type: 'select',
          options: [
            { label: 'شفاف', value: 'transparent' },
            { label: 'فاتح', value: 'light' },
            { label: 'غامق', value: 'dark' },
            { label: 'أساسي', value: 'primary' },
          ],
        },
        paddingY: {
          type: 'select',
          options: [
            { label: 'بدون', value: 'none' },
            { label: 'صغير', value: 'sm' },
            { label: 'متوسط', value: 'md' },
            { label: 'كبير', value: 'lg' },
            { label: 'كبير جداً', value: 'xl' },
          ],
        },
        maxWidth: {
          type: 'select',
          options: [
            { label: 'صغير', value: 'sm' },
            { label: 'متوسط', value: 'md' },
            { label: 'كبير', value: 'lg' },
            { label: 'كامل العرض', value: 'full' },
          ],
        },
      },
      defaultProps: {
        backgroundColor: 'transparent',
        paddingY: 'md',
        maxWidth: 'lg',
      },
      render: (props: any) => <Section {...props} />,
    },
    TwoColumns: {
      label: 'عمودان',
      fields: {
        split: {
          type: 'select',
          options: [
            { label: '50/50', value: '50-50' },
            { label: '60/40', value: '60-40' },
            { label: '40/60', value: '40-60' },
            { label: '70/30', value: '70-30' },
            { label: '30/70', value: '30-70' },
          ],
        },
        gap: {
          type: 'radio',
          options: [
            { label: 'صغير', value: 'sm' },
            { label: 'متوسط', value: 'md' },
            { label: 'كبير', value: 'lg' },
          ],
        },
        reverseOnMobile: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
      },
      defaultProps: {
        split: '50-50',
        gap: 'md',
        reverseOnMobile: true,
      },
      render: (props: any) => <TwoColumns {...props} />,
    },
    HeroBanner: {
      label: 'هيرو بانر',
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        backgroundImage: { type: 'text' },
        backgroundColor: {
          type: 'select',
          options: [
            { label: 'أساسي', value: 'primary' },
            { label: 'غامق', value: 'dark' },
            { label: 'فاتح', value: 'light' },
            { label: 'مخصص', value: 'custom' },
          ],
        },
        overlayOpacity: {
          type: 'select',
          options: [
            { label: 'بدون', value: 'none' },
            { label: 'خفيف', value: 'light' },
            { label: 'متوسط', value: 'medium' },
            { label: 'عالي', value: 'dark' },
          ],
        },
        textColor: {
          type: 'radio',
          options: [
            { label: 'أبيض', value: 'white' },
            { label: 'غامق', value: 'dark' },
          ],
        },
        buttonLabel: { type: 'text' },
        buttonHref: { type: 'text' },
        showButton: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
        minHeight: {
          type: 'select',
          options: [
            { label: 'صغير', value: 'sm' },
            { label: 'متوسط', value: 'md' },
            { label: 'كبير', value: 'lg' },
            { label: 'ملء الشاشة', value: 'full' },
          ],
        },
        contentAlign: {
          type: 'radio',
          options: [
            { label: 'يمين', value: 'right' },
            { label: 'وسط', value: 'center' },
            { label: 'يسار', value: 'left' },
          ],
        },
      },
      defaultProps: {
        title: 'عنوان رئيسي جذاب',
        subtitle: 'وصف مختصر يشرح ما تقدمه',
        backgroundImage: 'https://placehold.co/1400x600/0f172a/ffffff?text=Hero',
        backgroundColor: 'dark',
        overlayOpacity: 'medium',
        textColor: 'white',
        buttonLabel: 'اكتشف الآن',
        buttonHref: '#',
        showButton: true,
        minHeight: 'md',
        contentAlign: 'center',
      },
      render: (props: any) => <HeroBanner {...props} />,
    },
    ProductBlock: {
      label: 'بلوك منتج',
      fields: {
        productId: { type: 'text' },
        layout: {
          type: 'select',
          options: [
            { label: 'بطاقة عرض', value: 'card' },
            { label: 'هيرو', value: 'hero' },
            { label: 'بسيط', value: 'minimal' },
          ],
        },
        showPrice: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
        showDescription: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
        showRating: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
        checkoutMode: {
          type: 'select',
          options: [
            { label: 'شراء سريع (مودال)', value: 'modal' },
            { label: 'إضافة للسلة', value: 'cart' },
            { label: 'كلاهما', value: 'both' },
          ],
        },
        buttonLabel: { type: 'text' },
      },
      defaultProps: {
        productId: '',
        layout: 'card',
        showPrice: true,
        showDescription: true,
        showRating: true,
        checkoutMode: 'both',
        buttonLabel: 'اشتري الآن',
      },
      render: (props: any) => <ProductBlock {...props} />,
    },
    CountdownTimer: {
      label: 'عداد تنازلي',
      fields: {
        targetDate: { type: 'text' },
        title: { type: 'text' },
        expiredMessage: { type: 'text' },
        showDays: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
        showHours: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
        showMinutes: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
        showSeconds: {
          type: 'radio',
          options: [
            { label: 'نعم', value: true as any },
            { label: 'لا', value: false as any },
          ],
        },
        align: {
          type: 'radio',
          options: [
            { label: 'يمين', value: 'right' },
            { label: 'وسط', value: 'center' },
            { label: 'يسار', value: 'left' },
          ],
        },
        size: {
          type: 'select',
          options: [
            { label: 'صغير', value: 'sm' },
            { label: 'متوسط', value: 'md' },
            { label: 'كبير', value: 'lg' },
          ],
        },
      },
      defaultProps: {
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'ينتهي العرض خلال',
        expiredMessage: 'انتهى العرض',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        align: 'center',
        size: 'md',
      },
      render: (props: any) => <CountdownTimer {...props} />,
    },
  },
  categories: {
    widgets: {
      title: 'قطع الودجت',
      components: ['HeroBanner', 'ProductBlock', 'CountdownTimer'],
    },
    layout: {
      title: 'تنسيقات الصفحة',
      components: ['Section', 'TwoColumns'],
    },
    basic: {
      title: 'عناصر بسيطة',
      components: ['Spacer', 'TextBlock', 'Button', 'ImageBanner'],
    },
  },
};

export default puckConfig;
