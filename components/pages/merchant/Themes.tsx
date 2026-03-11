import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Download } from "lucide-react";
import { useUpdateStoreCustomizationMutation, useUploadStoreImageMutation } from '@/lib/services/productsApi';
import { useGetMyStoreQuery } from '@/lib/services/merchantApi';
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
      <div className="animate-pulse h-40 bg-gray-100 rounded" />
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
            <button title="إعادة" onClick={resetToDefaults} className="p-2 rounded hover:bg-gray-100">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 1 3 6.7" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
          </div>

          <div className="space-y-4 overflow-auto" style={{ flex: 1 }}>
            <div>
              <div className="text-xs text-gray-500 mb-2">المعلومات الأساسية</div>
              <Label>اسم المتجر / العلامة التجارية</Label>
              <Input value={config.storeName} onChange={e => setConfig(prev => ({ ...prev, storeName: e.target.value }))} className="mt-1" />
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2">الشعار</div>
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
              <div className="text-xs text-gray-500 mb-2">أيقونة المتجر</div>
              <div className="p-3 rounded flex items-center gap-3" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files?.[0]!, 'favicon')} />
                <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
                  {config.favicon ? <img src={config.favicon} alt="favicon" width={32} height={32} /> : <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>32x32</div>}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2">الألوان</div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm">اللون الرئيسي <div className="text-xs text-gray-400">الروابط والحدود</div></div>
                  <AdvancedColorPicker value={config.primaryColor} onChange={v => setConfig(prev => ({ ...prev, primaryColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون الخلفيات <div className="text-xs text-gray-400">الهيدر والبانر</div></div>
                  <AdvancedColorPicker value={config.secondaryColor} onChange={v => setConfig(prev => ({ ...prev, secondaryColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون التمييز <div className="text-xs text-gray-400">النجوم والشارات</div></div>
                  <AdvancedColorPicker value={config.accentColor} onChange={v => setConfig(prev => ({ ...prev, accentColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون الأزرار <div className="text-xs text-gray-400">خلفية الأزرار الرئيسية</div></div>
                  <AdvancedColorPicker value={config.buttonColor} onChange={v => setConfig(prev => ({ ...prev, buttonColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون العناوين <div className="text-xs text-gray-400">عناوين المنتجات والأقسام</div></div>
                  <AdvancedColorPicker value={config.headingColor} onChange={v => setConfig(prev => ({ ...prev, headingColor: v }))} />
                </div>

                <div>
                  <div className="text-sm">لون النصوص <div className="text-xs text-gray-400">نصوص الوصف والتفاصيل</div></div>
                  <AdvancedColorPicker value={config.textColor} onChange={v => setConfig(prev => ({ ...prev, textColor: v }))} />
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2">الزوايا</div>
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
              <div className="text-xs text-gray-500 mb-2">الخط</div>
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
            <button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 text-white py-2 rounded">
              {isSaving ? 'جاري الحفظ...' : 'حفظ الهوية البصرية'}
            </button>
          </div>
        </aside>

        
        
      </div>
    </Card>
  )
}

export default function Themes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">القوالب</h1>
        <p className="text-muted-foreground">اختر قالب احترافي لمتجرك</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {["الكل", "أزياء", "إلكترونيات", "طعام", "رياضة"].map((cat, i) => (
          <Button
            key={i}
            variant={i === 0 ? "default" : "outline"}
            className={i === 0 ? "bg-accent text-black hover:bg-accent/90" : ""}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { name: "Modern Shop", price: "مجاني", popular: false },
          { name: "Sports Elite", price: "399 ر.س", popular: false },
        ].map((theme, i) => (
          <Card key={i} className="overflow-hidden">
            {theme.popular && (
              <div className="bg-accent text-black px-4 py-1 text-xs font-bold text-center">
                الأكثر شعبية
              </div>
            )}
            <div className="aspect-[4/3] bg-secondary border-b border-border"></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{theme.name}</h3>
                <span className="text-sm font-medium">{theme.price}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 ml-1" />
                  معاينة
                </Button>
                <Button size="sm" className="flex-1 bg-accent text-black hover:bg-accent/90">
                  <Download className="w-4 h-4 ml-1" />
                  تثبيت
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BrandIdentitySection />
    </div>
  );
}
