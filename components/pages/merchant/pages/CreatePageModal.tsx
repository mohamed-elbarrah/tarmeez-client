'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetProductsQuery } from '@/lib/services/productsApi';
import { useCreatePageMutation } from '@/lib/services/pagesApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Templates
import blankTemplate from '@/lib/page-builder/templates/blank.json';
import landingTemplate from '@/lib/page-builder/templates/landing-product.json';
import promoTemplate from '@/lib/page-builder/templates/promo-sale.json';

const templateMap: Record<string, any> = {
  'blank': blankTemplate,
  'landing-product': landingTemplate,
  'promo-sale': promoTemplate,
};

const formSchema = z.object({
  title: z.string().min(2, 'العنوان يجب أن يكون حرفين على الأقل'),
  slug: z.string().min(1, 'الرابط مطلوب').regex(/^[a-z0-9-]+$/, 'الرابط يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطات فقط'),
  type: z.enum(['LANDING', 'CUSTOM']),
  linkedProductId: z.string().optional(),
  template: z.enum(['blank', 'landing-product', 'promo-sale']),
});

type PageFormValues = z.infer<typeof formSchema>;

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const templates = [
  { id: 'blank', title: 'صفحة فارغة', description: 'ابدأ من الصفر' },
  { id: 'landing-product', title: 'قالب هبوط منتج', description: 'تصميم مخصص لزيادة المبيعات' },
  { id: 'promo-sale', title: 'قالب عرض خاص', description: 'مثالي للعروض المؤقتة' },
];

export default function CreatePageModal({ isOpen, onClose }: CreatePageModalProps) {
  const router = useRouter();
  const { data: productsData } = useGetProductsQuery();
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation();

  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      type: 'CUSTOM',
      linkedProductId: '',
      template: 'blank',
    },
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    form.setValue('title', val);
    
    // Only auto-generate slug if it was empty or matched previous title
    const currentSlug = form.getValues('slug');
    if (!currentSlug || currentSlug === generateSlug(form.getValues('title'))) {
      form.setValue('slug', generateSlug(val));
    }
  };

  const sanitizeSlugInput = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[\u0600-\u06FF]/g, '') // Remove Arabic
      .replace(/[^a-z0-9-]/g, '')      // Keep only safe chars
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const pageType = form.watch('type');

  async function onSubmit(values: PageFormValues) {
    if (values.type === 'LANDING' && !values.linkedProductId) {
      toast.error('يجب اختيار منتج لصفحة الهبوط');
      return;
    }

    try {
      const initialContent = templateMap[values.template] || blankTemplate;
      
      const newPage = await createPage({
        title: values.title,
        slug: values.slug,
        type: values.type,
        linkedProductId: values.linkedProductId,
        content: initialContent,
      }).unwrap();

      toast.success('تم إنشاء الصفحة بنجاح');
      onClose();
      router.push(`/merchant/pages/${newPage.id}/edit`);
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الصفحة');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء صفحة جديدة</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الصفحة</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="مثلاً: عرض الجمعة البيضاء" 
                      {...field} 
                      onChange={handleTitleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الصفحة (Slug)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="black-friday-offer" 
                      {...field} 
                      dir="ltr"
                      onChange={(e) => field.onChange(sanitizeSlugInput(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    يُستخدم في رابط الصفحة — أحرف إنجليزية وأرقام وشرطات فقط
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>نوع الصفحة</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="CUSTOM" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          صفحة مخصصة (Custom Page)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="LANDING" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          صفحة هبوط لمنتج (Landing Page)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {pageType === 'LANDING' && (
              <FormField
                control={form.control}
                name="linkedProductId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اختر المنتج</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر منتجاً..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productsData?.products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>اختر قالباً</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-2"
                    >
                      {templates.map((t) => (
                        <FormItem key={t.id} className="flex items-center space-x-3 space-x-reverse border rounded-lg p-3 hover:bg-accent/5 cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value={t.id} />
                          </FormControl>
                          <div className="flex-1">
                            <FormLabel className="font-medium cursor-pointer block">{t.title}</FormLabel>
                            <p className="text-xs text-muted-foreground">{t.description}</p>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
              <Button type="submit" disabled={isCreating} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isCreating ? 'جاري الإنشاء...' : 'بدء التصميم'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
