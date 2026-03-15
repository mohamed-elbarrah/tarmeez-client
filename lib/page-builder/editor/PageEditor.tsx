'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Config } from '@puckeditor/core';
import '@puckeditor/core/dist/index.css';
import { puckConfig } from '../puck.config';
import { 
  useUpdatePageMutation, 
  useUpdatePageStatusMutation 
} from '@/lib/services/pagesApi';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Send, 
  Eye, 
  Settings as SettingsIcon, 
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import dynamic from 'next/dynamic';

const Puck = dynamic(
  () => import('@puckeditor/core').then(m => m.Puck),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">جاري تحميل المحرر...</p>
        </div>
      </div>
    )
  }
);

interface PageEditorProps {
  page: {
    id: string;
    title: string;
    type: 'LANDING' | 'CUSTOM' | 'POLICY';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    content: Record<string, any>;
    showHeader: boolean;
    showFooter: boolean;
    linkedProductId: string | null;
    storeSlug: string;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
  };
}

export default function PageEditor({ page: initialPage }: PageEditorProps) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [updatePage, { isLoading: isSaving }] = useUpdatePageMutation();
  const [updateStatus, { isLoading: isStatusChanging }] = useUpdatePageStatusMutation();
  
  // Puck state management
  const initialData = page.content?.puckData || { content: [], root: { props: {} } };

  const handleSave = useCallback(async (currentData: any, isAutoSave = false) => {
    try {
      const content = {
        version: 1,
        puckData: currentData
      };

      await updatePage({
        id: page.id,
        content,
        showHeader: page.showHeader,
        showFooter: page.showFooter,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription
      }).unwrap();

      if (!isAutoSave) {
        toast.success('تم حفظ التعديلات بنجاح');
      } else {
        toast.info('تم الحفظ تلقائياً', { duration: 2000 });
      }
    } catch (error) {
      if (!isAutoSave) toast.error('حدث خطأ أثناء الحفظ');
    }
  }, [page, updatePage]);

  // Auto-save logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Note: We need the current puck state. 
      // Puck doesn't expose state directly easily without a ref or external state manager,
      // but we can use the onChange callback to keep a local copy.
    }, 30000);

    return () => clearInterval(interval);
  }, [handleSave]);

  const onPublishToggle = async () => {
    try {
      const newStatus = page.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      await updateStatus({ id: page.id, status: newStatus }).unwrap();
      setPage(prev => ({ ...prev, status: newStatus as any }));
      toast.success(newStatus === 'PUBLISHED' ? 'تم نشر الصفحة' : 'تم إلغاء نشر الصفحة');
    } catch (error: any) {
      toast.error(error?.data?.message || 'حدث خطأ أثناء تغيير حالة الصفحة');
    }
  };

  const onPreview = () => {
    window.open(`/store/${page.storeSlug}/p/${page.slug}?preview=true`, '_blank');
  };

  const updateLocalSettings = (key: string, value: any) => {
    setPage(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-screen flex flex-col bg-background" dir="rtl">
      {/* Editor Toolbar */}
      <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/merchant/pages')}>
            <ArrowRight className="w-4 h-4 ml-2" />
            رجوع
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-bold text-lg truncate max-w-[200px]">{page.title}</h1>
          <Badge variant={page.status === 'PUBLISHED' ? 'default' : 'secondary'} className="mr-2">
            {page.status === 'PUBLISHED' ? 'منشورة' : 'مسودة'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="w-4 h-4 ml-2" />
            معاينة
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <SettingsIcon className="w-4 h-4 ml-2" />
                الإعدادات
              </Button>
            </SheetTrigger>
            <SheetContent side="left" dir="rtl">
              <SheetHeader>
                <SheetTitle>إعدادات الصفحة</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-4 border-b pb-6">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">تنسيق الصفحة</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-header">إظهار الهيدر</Label>
                    <Switch 
                      id="show-header" 
                      checked={page.showHeader} 
                      onCheckedChange={(v) => updateLocalSettings('showHeader', v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-footer">إظهار الفوتر</Label>
                    <Switch 
                      id="show-footer" 
                      checked={page.showFooter} 
                      onCheckedChange={(v) => updateLocalSettings('showFooter', v)} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">SEO</h3>
                  <div className="space-y-2">
                    <Label>عنوان محرك البحث (SEO Title)</Label>
                    <Input 
                      value={page.seoTitle || ''} 
                      onChange={(e) => updateLocalSettings('seoTitle', e.target.value)}
                      placeholder="اتركه فارغاً لاستخدام عنوان الصفحة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>وصف محرك البحث (SEO Description)</Label>
                    <Textarea 
                      value={page.seoDescription || ''} 
                      onChange={(e) => updateLocalSettings('seoDescription', e.target.value)}
                      placeholder="وصف مختصر للصفحة يظهر في نتائج البحث..."
                      rows={4}
                    />
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={() => handleSave(initialData)}>
                  حفظ الإعدادات
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="h-6 w-px bg-border mx-2" />

          <Button 
            variant={page.status === 'PUBLISHED' ? 'outline' : 'default'}
            size="sm"
            onClick={onPublishToggle}
            disabled={isStatusChanging}
            className={page.status === 'PUBLISHED' ? 'text-destructive border-destructive hover:bg-destructive/10' : 'bg-accent text-black hover:bg-accent/90'}
          >
            {isStatusChanging ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : (page.status === 'PUBLISHED' ? <XCircle className="w-4 h-4 ml-2" /> : <Send className="w-4 h-4 ml-2" />)}
            {page.status === 'PUBLISHED' ? 'إلغاء النشر' : 'نشر الصفحة'}
          </Button>

          <Button 
            disabled={isSaving} 
            size="sm" 
            onClick={() => handleSave(initialData)}
            className="bg-primary text-primary-foreground"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
            حفظ
          </Button>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden puck-editor-container">
        <Puck
          config={puckConfig as Config}
          data={initialData}
          onPublish={(data) => handleSave(data)}
          onChange={(data) => {
            // We could update local state here to track dirty state
          }}
          headerTitle={page.title}
        />
      </div>

      <style jsx global>{`
        .puck-editor-container [dir="rtl"] {
          direction: ltr; /* Puck UI is LTR internally, we only want the content area to respect RTL if possible */
        }
        .puck-editor-container .Puck {
          --puck-color-primary: var(--p-color);
        }
      `}</style>
    </div>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: any, className?: string }) {
  const styles: any = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border text-foreground'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[variant || 'default']} ${className}`}>
      {children}
    </span>
  );
}
