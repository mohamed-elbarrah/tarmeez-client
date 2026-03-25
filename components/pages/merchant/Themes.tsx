import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye, CheckCircle2, Loader2 } from "lucide-react";
import {
  useUpdateStoreCustomizationMutation,
  useUploadStoreImageMutation,
} from '@/lib/services/productsApi';
import {
  useGetMyStoreQuery,
  useGetAvailableThemesQuery,
  useSwitchThemeMutation,
} from '@/lib/services/merchantApi';
import React from "react";

const AdvancedColorPicker: React.FC<{
  value: string
  onChange: (hex: string) => void
  label?: string
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = React.useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return
      if (!(e.target instanceof Node)) return
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const quick = [
    "#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5",
    "#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50",
    "#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800",
    "#FF5722","#795548","#9E9E9E","#607D8B","#000000",
  ]

  const [hex, setHex] = useState(value)
  useEffect(() => setHex(value), [value])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2">
        <span style={{ background: value }} className="w-6 h-6 rounded" />
        <div className="text-sm">{value}</div>
      </button>

      {open && (
        <div
          className="absolute z-50 right-0 mt-2 w-64 p-3 rounded shadow-lg"
          style={{ backgroundColor: 'var(--color-popover)', borderColor: 'var(--color-border)', color: 'var(--color-popover-foreground)' }}
        >
          <input type="color" value={hex} onChange={e => { setHex(e.target.value); onChange(e.target.value) }} className="w-full h-12 p-0" />
          <div className="mt-2 flex items-center gap-2">
            <input
              value={hex}
              onChange={e => setHex(e.target.value)}
              onBlur={() => onChange(hex)}
              className="text-sm p-1 rounded w-full"
              style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)', borderStyle: 'solid' }}
            />
          </div>

          <div className="grid grid-cols-10 gap-1 mt-3">
            {quick.map(c => (
              <button key={c} onClick={() => { setHex(c); onChange(c) }} style={{ background: c, borderColor: 'var(--color-border)' }} className="w-6 h-6 rounded border" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const NumberInput: React.FC<{
  value: number | string
  min: number
  max: number
  onChange: (v: number) => void
  suffix?: string
}> = ({ value, min, max, onChange, suffix }) => {
  const num = Number(value || 0)
  return (
    <div>
      <input className="w-full" type="range" min={min} max={max} value={num} onChange={e => onChange(Number(e.target.value))} />
      <div className="flex items-center gap-2 mt-2">
        <input
          type="number"
          value={num}
          onChange={e => onChange(Number(e.target.value))}
          className="w-20 rounded px-2 py-1"
          style={{ backgroundColor: 'var(--color-input)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}
        />
        {suffix && <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{suffix}</div>}
      </div>
    </div>
  )
}

const BrandIdentitySection = () => {
  const { data, isLoading } = useGetMyStoreQuery()
  const [updateCustomization, { isLoading: isSaving }] = useUpdateStoreCustomizationMutation()
  const [uploadStoreImage] = useUploadStoreImageMutation()
  const [device, setDevice] = useState<'desktop'|'mobile'>('desktop')

  const [config, setConfig] = useState({
    storeName: '',
    logo: '',
    logoWidth: 120,
    logoHeight: 40,
    showStoreName: true,
    favicon: '',
    primaryColor: '#2563eb',
    secondaryColor: '#0f172a',
    accentColor: '#f59e0b',
    textColor: '#1e293b',
    headingColor: '#000000',
    buttonColor: '#2563eb',
    fontFamily: "'Cairo', sans-serif",
    borderRadius: '20px',
  })

  useEffect(() => {
    if (data?.store) {
      const s: any = data.store
      setConfig({
        storeName: s.storeName ?? s.name ?? '',
        logo: s.logo ?? '',
        logoWidth: s.logoWidth ?? 120,
        logoHeight: s.logoHeight ?? 40,
        showStoreName: s.showStoreName ?? true,
        favicon: s.favicon ?? '',
        primaryColor: s.primaryColor ?? '#2563eb',
        secondaryColor: s.secondaryColor ?? '#0f172a',
        accentColor: s.accentColor ?? '#f59e0b',
        textColor: s.textColor ?? '#1e293b',
        headingColor: s.headingColor ?? '#000000',
        buttonColor: s.buttonColor ?? '#2563eb',
        fontFamily: s.fontFamily ?? "'Cairo', sans-serif",
        borderRadius: s.borderRadius ?? '20px',
      })
    }
  }, [data])

  useEffect(() => {
    const name = (config.fontFamily || '').split(',')[0].replace(/['"]/g, '').trim()
    if (!name) return
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@300;400;600;700&display=swap`
    const existing = document.querySelector(`link[data-font='${name}']`)
    if (!existing) {
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      l.setAttribute('data-font', name)
      document.head.appendChild(l)
    }
  }, [config.fontFamily])

  const handleUpload = async (file?: File, key: 'logo'|'favicon' = 'logo') => {
    if (!file) return
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await uploadStoreImage(form).unwrap()
      setConfig(prev => ({ ...prev, [key]: res.url }))
    } catch (err) {
      console.error(err)
      alert('فشل رفع الصورة')
    }
  }

  const handleSave = async () => {
    try {
      await updateCustomization({
        storeName: config.storeName,
        logo: config.logo,
        logoWidth: config.logoWidth,
        logoHeight: config.logoHeight,
        showStoreName: config.showStoreName,
        favicon: config.favicon || null,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        textColor: config.textColor,
        headingColor: config.headingColor,
        buttonColor: config.buttonColor,
        fontFamily: config.fontFamily,
        borderRadius: config.borderRadius,
      }).unwrap()
      // use Sonner toast
      const { toast } = await import('sonner')
      toast.success('تم حفظ الهوية البصرية بنجاح ✓')
    } catch (err) {
      console.error(err)
      alert('فشل الحفظ')
    }
  }

  const resetToDefaults = () => {
    setConfig({
      storeName: '', logo: '', logoWidth: 120, logoHeight: 40, showStoreName: true, favicon: '',
      primaryColor: '#2563eb', secondaryColor: '#0f172a', accentColor: '#f59e0b', textColor: '#1e293b', headingColor: '#000000', buttonColor: '#2563eb',
      fontFamily: "'Cairo', sans-serif", borderRadius: '20px',
    })
  }

  if (isLoading) return (
    <Card className="p-6 mt-8">
      <div className="animate-pulse h-40 bg-muted rounded" />
    </Card>
  )

  return (
    <Card className="p-6 mt-8">
      <div className="flex rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}>
        {/* RIGHT: Controls (rtl) */}
        <aside className="m-auto flex flex-col p-4" dir="rtl" style={{ backgroundColor: 'var(--color-card)', borderLeft: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5"/></svg>
              <div className="font-bold">تخصيص الهوية</div>
            </div>
            <button title="إعادة" onClick={resetToDefaults} className="p-2 rounded hover:bg-muted">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 1 3 6.7" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
          </div>

          <div className="space-y-4 overflow-auto" style={{ flex: 1 }}>
            <div>
              <div className="text-xs text-muted-foreground mb-2">المعلومات الأساسية</div>
              <Label>اسم المتجر / العلامة التجارية</Label>
              <Input value={config.storeName} onChange={e => setConfig(prev => ({ ...prev, storeName: e.target.value }))} className="mt-1" />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">الشعار</div>
              <div className="p-3 rounded flex flex-col gap-2" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <label className="text-sm">رفع الشعار</label>
                <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files?.[0]!, 'logo')} />
                <div className="flex items-center gap-3">
                  <div className="w-32 h-12 flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
                    {config.logo ? <img src={config.logo} alt="logo" style={{ width: config.logoWidth, height: config.logoHeight, objectFit: 'contain' }} /> : <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>رفع الشعار</div>}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs">عرض الشعار</div>
                    <NumberInput value={config.logoWidth} min={40} max={300} onChange={v => setConfig(prev => ({ ...prev, logoWidth: v }))} />
                    <div className="text-xs mt-2">ارتفاع الشعار</div>
                    <NumberInput value={config.logoHeight} min={20} max={150} onChange={v => setConfig(prev => ({ ...prev, logoHeight: v }))} />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => setConfig(prev => ({ ...prev, logoWidth: 80, logoHeight: 30 }))} className="px-2 py-1 border rounded text-sm">صغير</button>
                      <button onClick={() => setConfig(prev => ({ ...prev, logoWidth: 120, logoHeight: 40 }))} className="px-2 py-1 border rounded text-sm">متوسط</button>
                      <button onClick={() => setConfig(prev => ({ ...prev, logoWidth: 180, logoHeight: 60 }))} className="px-2 py-1 border rounded text-sm">كبير</button>
                    </div>
                    <label className="flex items-center gap-2 mt-2 text-sm"><input type="checkbox" checked={config.showStoreName} onChange={e => setConfig(prev => ({ ...prev, showStoreName: e.target.checked }))} /> إظهار الاسم بجانب الشعار</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">أيقونة المتجر</div>
              <div className="p-3 rounded flex items-center gap-3" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files?.[0]!, 'favicon')} />
                <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
                  {config.favicon ? <img src={config.favicon} alt="favicon" width={32} height={32} /> : <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>32x32</div>}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">الألوان</div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm">اللون الرئيسي <div className="text-xs text-muted-foreground">الروابط والحدود</div></div>
                  <AdvancedColorPicker value={config.primaryColor} onChange={v => setConfig(prev => ({ ...prev, primaryColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون الخلفيات <div className="text-xs text-muted-foreground">الهيدر والبانر</div></div>
                  <AdvancedColorPicker value={config.secondaryColor} onChange={v => setConfig(prev => ({ ...prev, secondaryColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون التمييز <div className="text-xs text-muted-foreground">النجوم والشارات</div></div>
                  <AdvancedColorPicker value={config.accentColor} onChange={v => setConfig(prev => ({ ...prev, accentColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون الأزرار <div className="text-xs text-muted-foreground">خلفية الأزرار الرئيسية</div></div>
                  <AdvancedColorPicker value={config.buttonColor} onChange={v => setConfig(prev => ({ ...prev, buttonColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون العناوين <div className="text-xs text-muted-foreground">عناوين المنتجات والأقسام</div></div>
                  <AdvancedColorPicker value={config.headingColor} onChange={v => setConfig(prev => ({ ...prev, headingColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون النصوص <div className="text-xs text-muted-foreground">نصوص الوصف والتفاصيل</div></div>
                  <AdvancedColorPicker value={config.textColor} onChange={v => setConfig(prev => ({ ...prev, textColor: v }))} />
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">الزوايا</div>
              <div className="p-3 rounded" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <NumberInput value={parseInt(config.borderRadius || '0')} min={0} max={40} onChange={v => setConfig(prev => ({ ...prev, borderRadius: `${v}px` }))} suffix="px" />
                <div className="flex gap-2 mt-3">
                  {[{ value: '0px', label: 'حاد' }, { value: '8px', label: 'خفيف' }, { value: '16px', label: 'متوسط' }, { value: '20px', label: 'افتراضي' }, { value: '32px', label: 'دائري' }, { value: '9999px', label: 'كامل' }].map(opt => (
                    <button key={opt.value} onClick={() => setConfig(prev => ({ ...prev, borderRadius: opt.value }))} className="p-2 border rounded flex items-center gap-2">
                      <div style={{ width: 36, height: 18, borderRadius: opt.value, background: '#eee' }} />
                      <div className="text-xs">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">الخط</div>
              <select value={config.fontFamily} onChange={e => setConfig(prev => ({ ...prev, fontFamily: e.target.value }))} className="w-full mt-1 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-input)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}>
                <option value="'Cairo', sans-serif">Cairo</option>
                <option value="'Tajawal', sans-serif">Tajawal</option>
                <option value="'Noto Sans Arabic', sans-serif">Noto Sans Arabic</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Poppins', sans-serif">Poppins</option>
              </select>
              <div className="mt-3 p-3 rounded" style={{ fontFamily: config.fontFamily, backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-card-foreground)' }}>
                مرحبياً بكم في متجرنا – Welcome
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 p-4" style={{ backgroundColor: 'var(--color-card)', borderTop: '1px solid var(--color-border)' }}>
            <button onClick={handleSave} disabled={isSaving} className="w-full bg-primary text-primary-foreground py-2 rounded">
              {isSaving ? 'جاري الحفظ...' : 'حفظ الهوية البصرية'}
            </button>
          </div>
        </aside>

        
        
      </div>
    </Card>
  )
}

// ─── Theme Grid ─────────────────────────────────────────────────────────────

interface ThemeRecord {
  id: string
  slug: string
  name: string
  previewImage: string | null
}

/** Skeleton placeholder shown while fetching themes */
const ThemeCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-4/3 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  </Card>
)

/** Single theme card */
const ThemeCard = ({
  theme,
  isActive,
  onActivate,
  isSwitching,
}: {
  theme: ThemeRecord
  isActive: boolean
  onActivate: (theme: ThemeRecord) => void
  isSwitching: boolean
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <>
      <Card className={`overflow-hidden transition-all ${isActive ? 'ring-2 ring-primary' : ''}`}>
        {/* Preview image / placeholder */}
        <div
          className="aspect-4/3 bg-muted flex items-center justify-center relative cursor-pointer group border-b border-border"
          onClick={() => theme.previewImage && setPreviewOpen(true)}
        >
          {theme.previewImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={theme.previewImage}
              alt={theme.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">{theme.name}</span>
          )}
          {theme.previewImage && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Eye className="w-6 h-6 text-white" />
            </div>
          )}
          {isActive && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500/90 text-white text-xs gap-1">
                <CheckCircle2 className="w-3 h-3" />
                نشط
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">{theme.name}</h3>
            {isActive && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-500">
                مفعّل
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            {/* Preview — only shown when a previewImage exists */}
            {theme.previewImage && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="w-4 h-4 ml-1" />
                معاينة
              </Button>
            )}

            <Button
              size="sm"
              className="flex-1"
              disabled={isActive || isSwitching}
              onClick={() => onActivate(theme)}
            >
              {isSwitching ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : isActive ? (
                'مفعّل'
              ) : (
                'تفعيل'
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{theme.name}</DialogTitle>
          </DialogHeader>
          {theme.previewImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={theme.previewImage}
              alt={theme.name}
              className="w-full rounded-lg"
            />
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إغلاق</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** Confirmation dialog before switching themes */
const ConfirmSwitchDialog = ({
  open,
  theme,
  onConfirm,
  onCancel,
  isSwitching,
}: {
  open: boolean
  theme: ThemeRecord | null
  onConfirm: () => void
  onCancel: () => void
  isSwitching: boolean
}) => (
  <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel() }}>
    <DialogContent dir="rtl">
      <DialogHeader>
        <DialogTitle>تغيير القالب</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">
        هل أنت متأكد من تغيير القالب إلى &quot;{theme?.name}&quot;؟ قد تتغير بعض إعدادات الألوان الافتراضية.
      </p>
      <DialogFooter className="flex-row-reverse gap-2">
        <Button onClick={onConfirm} disabled={isSwitching}>
          {isSwitching ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : null}
          تأكيد التغيير
        </Button>
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>إلغاء</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

/** Theme gallery section */
const ThemeGallery = () => {
  const { data: storeData } = useGetMyStoreQuery()
  const { data: themes, isLoading, isError } = useGetAvailableThemesQuery()
  const [switchTheme, { isLoading: isSwitching }] = useSwitchThemeMutation()

  const [pendingTheme, setPendingTheme] = useState<ThemeRecord | null>(null)
  const activeThemeId = storeData?.store?.themeId ?? null

  const handleActivate = (theme: ThemeRecord) => {
    setPendingTheme(theme)
  }

  const handleConfirm = async () => {
    if (!pendingTheme) return
    try {
      await switchTheme({ themeId: pendingTheme.id }).unwrap()
      const { toast } = await import('sonner')
      toast.success(`تم تفعيل قالب "${pendingTheme.name}" بنجاح ✓`)
    } catch {
      const { toast } = await import('sonner')
      toast.error('فشل تغيير القالب، يرجى المحاولة مجدداً')
    } finally {
      setPendingTheme(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <ThemeCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive text-sm mb-3">تعذّر تحميل القوالب</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </Card>
    )
  }

  if (!themes || themes.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground text-sm">
        لا توجد قوالب متاحة حالياً
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(themes as ThemeRecord[]).map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={theme.id === activeThemeId}
            onActivate={handleActivate}
            isSwitching={isSwitching && pendingTheme?.id === theme.id}
          />
        ))}
      </div>

      <ConfirmSwitchDialog
        open={!!pendingTheme}
        theme={pendingTheme}
        onConfirm={handleConfirm}
        onCancel={() => setPendingTheme(null)}
        isSwitching={isSwitching}
      />
    </>
  )
}

export default function Themes() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold mb-2">القوالب</h1>
        <p className="text-muted-foreground">اختر قالب احترافي لمتجرك</p>
      </div>

      <ThemeGallery />

      <BrandIdentitySection />
    </div>
  );
}
