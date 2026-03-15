'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from "@/lib/utils";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [updatePage, { isLoading: isSavingManual }] = useUpdatePageMutation();
  const [updateStatus, { isLoading: isStatusChanging }] = useUpdatePageStatusMutation();
  
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentPuckData, setCurrentPuckData] = useState(page.content?.puckData || { content: [], root: { props: {} } });
  
  // Puck state management
  const initialData = page.content?.puckData || { content: [], root: { props: {} } };

  const handleSave = useCallback(async (currentData: any, isAutoSave = false) => {
    setSaveStatus('saving');
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

      setSaveStatus('saved');
      if (!isAutoSave) {
        toast.success('تم حفظ التعديلات بنجاح');
      }
    } catch (error) {
      setSaveStatus('error');
      if (!isAutoSave) toast.error('حدث خطأ أثناء الحفظ');
    }
  }, [page, updatePage]);

  // Handle puck data change
  const onDataChange = useCallback((data: any) => {
    setCurrentPuckData(data);
    setSaveStatus('unsaved');
    
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    
    saveTimerRef.current = setTimeout(() => {
      handleSave(data, true);
    }, 30000);
  }, [handleSave]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Browser level unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  const onBack = () => {
    if (saveStatus === 'unsaved') {
      setShowExitDialog(true);
    } else {
      router.push('/merchant/pages');
    }
  };

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

  const sanitizeSlugInput = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[\u0600-\u06FF]/g, '') // Remove Arabic
      .replace(/[^a-z0-9-]/g, '')      // Keep only safe chars
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="h-screen flex flex-col bg-background" dir="rtl">
      {/* Editor Toolbar */}
      <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowRight className="w-4 h-4 ml-2" />
            رجوع
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-bold text-lg truncate max-w-[200px]">{page.title}</h1>
          <Badge variant={page.status === 'PUBLISHED' ? 'default' : 'secondary'} className="mr-2">
            {page.status === 'PUBLISHED' ? 'منشورة' : 'مسودة'}
          </Badge>
          
          <div className="flex items-center gap-2 mr-4 bg-muted/50 px-3 py-1 rounded-full text-xs font-medium border border-border">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                <span>جاري الحفظ...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>تم الحفظ</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span>تغييرات غير محفوظة</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-destructive">فشل الحفظ</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => handleSave(currentPuckData)}
                >
                  <Save className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
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

                  <div className="space-y-4 border-b pb-6">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">الرابط</h3>
                    <div className="space-y-2">
                      <Label>رابط الصفحة (Slug)</Label>
                      <Input 
                        value={page.slug || ''} 
                        onChange={(e) => updateLocalSettings('slug', sanitizeSlugInput(e.target.value))}
                        dir="ltr"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        يُستخدم في رابط الصفحة — أحرف إنجليزية وأرقام وشرطات فقط
                      </p>
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
                    <div className="flex justify-between items-center">
                      <Label>وصف محرك البحث (SEO Description)</Label>
                      <span className={cn(
                        "text-[10px]",
                        (page.seoDescription?.length || 0) > 160 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {page.seoDescription?.length || 0}/160
                      </span>
                    </div>
                    <Textarea 
                      value={page.seoDescription || ''} 
                      onChange={(e) => updateLocalSettings('seoDescription', e.target.value)}
                      placeholder="وصف مختصر للصفحة يظهر في نتائج البحث..."
                      rows={4}
                      className={cn((page.seoDescription?.length || 0) > 160 && "border-destructive")}
                    />
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={() => handleSave(currentPuckData)}>
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
            disabled={saveStatus === 'saving'} 
            size="sm" 
            onClick={() => handleSave(currentPuckData)}
            className="bg-primary text-primary-foreground"
          >
            {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
            حفظ
          </Button>
        </div>
      </header>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>لديك تغييرات غير محفوظة</AlertDialogTitle>
            <AlertDialogDescription>
              لقد أجريت تغييرات لم يتم حفظها بعد. هل تريد حفظها قبل المغادرة أم المغادرة بدون حفظ؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <Button 
              onClick={async () => {
                await handleSave(currentPuckData);
                router.push('/merchant/pages');
              }}
            >
              احفظ وغادر
            </Button>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => router.push('/merchant/pages')}
            >
              غادر بدون حفظ
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden puck-editor-container">
        <Puck
          config={puckConfig as Config}
          data={currentPuckData}
          onPublish={(data) => handleSave(data)}
          onChange={onDataChange}
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
