import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Download } from "lucide-react";
import { useUpdateStoreCustomizationMutation, useUploadStoreImageMutation } from '@/lib/services/productsApi';
import { useGetMyStoreQuery } from '@/lib/services/merchantApi';

const BrandIdentitySection = () => {
  const { data, isLoading } = useGetMyStoreQuery();
  const [updateCustomization, { isLoading: isSaving }] = useUpdateStoreCustomizationMutation();

  const [logo, setLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoWidth, setLogoWidth] = useState(120);
  const [logoHeight, setLogoHeight] = useState(40);
  const [showStoreName, setShowStoreName] = useState(true);
  const [favicon, setFavicon] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#0f172a');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const [fontFamily, setFontFamily] = useState("'Cairo', sans-serif");
  const [borderRadius, setBorderRadius] = useState('20px');
  const [logoError, setLogoError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  const [uploadStoreImage] = useUploadStoreImageMutation();

  useEffect(() => {
    if (data?.store) {
      const s = data.store as any;
      setLogo(s.logo ?? '');
      setLogoPreview(null);
      setLogoWidth(s.logoWidth ?? 120);
      setLogoHeight(s.logoHeight ?? 40);
      setShowStoreName(s.showStoreName ?? true);
      setFavicon(s.favicon ?? null);
      setFaviconPreview(null);
      setPrimaryColor(s.primaryColor ?? '#2563eb');
      setSecondaryColor(s.secondaryColor ?? '#0f172a');
      setAccentColor(s.accentColor ?? '#f59e0b');
      setFontFamily(s.fontFamily ?? "'Cairo', sans-serif");
      setBorderRadius(s.borderRadius ?? '20px');
      setLogoError(false);
      setFaviconError(false);
    }
  }, [data]);

  // Load Google Font when fontFamily changes (simple heuristic)
  useEffect(() => {
    const name = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    if (!name) return;
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@300;400;600;700&display=swap`;
    const existing = document.querySelector(`link[data-font='${name}']`);
    if (!existing) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      l.setAttribute('data-font', name);
      document.head.appendChild(l);
    }
  }, [fontFamily]);

  const handleSave = async () => {
    try {
      await updateCustomization({
        logo,
        logoWidth,
        logoHeight,
        showStoreName,
        favicon: favicon ?? null,
        primaryColor,
        secondaryColor,
        accentColor,
        fontFamily,
        borderRadius,
      }).unwrap();
      alert('تم حفظ الهوية البصرية بنجاح ✓');
    } catch (e) {
      console.error(e);
      alert('فشل الحفظ، حاول مرة أخرى');
    }
  };

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError(false);
    const localUrl = URL.createObjectURL(file);
    setLogoPreview(localUrl);
    setIsUploadingLogo(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await uploadStoreImage(form).unwrap();
      setLogo(res.url);
      setLogoPreview(null);
    } catch (err) {
      console.error(err);
      setLogoError(true);
      alert('فشل رفع الشعار');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFaviconFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconError(false);
    const localUrl = URL.createObjectURL(file);
    setFaviconPreview(localUrl);
    setIsUploadingFavicon(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await uploadStoreImage(form).unwrap();
      setFavicon(res.url);
      setFaviconPreview(null);
    } catch (err) {
      console.error(err);
      setFaviconError(true);
      alert('فشل رفع الفيفيكون');
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const borderOptions = [
    { value: '0px', label: 'حاد' },
    { value: '8px', label: 'خفيف' },
    { value: '16px', label: 'متوسط' },
    { value: '20px', label: 'افتراضي' },
    { value: '32px', label: 'دائري' },
    { value: '9999px', label: 'كامل' },
  ];

  if (isLoading) {
    return (
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-bold mb-6">الهوية البصرية</h2>
        <div className="animate-pulse h-40 bg-gray-100 rounded" />
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-xl font-bold mb-6">الهوية البصرية</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Logo Section */}
        <div className="col-span-2">
          <Label>شعار المتجر</Label>
          <input type="file" accept="image/*" onChange={handleLogoFile} className="mt-2" />
          {isUploadingLogo && <div className="text-sm text-gray-500 mt-2">جاري رفع الشعار...</div>}
          <div className="mt-3 flex items-center gap-4">
            { (logoPreview || logo) && !logoError ? (
              <img src={logoPreview ?? logo ?? ''} alt="logo preview" width={logoWidth} height={logoHeight} style={{ objectFit: 'contain' }} onError={() => setLogoError(true)} />
            ) : (
              <div className="text-sm font-bold">{data?.store.name}</div>
            )}
            <div className="flex flex-col">
              <label className="text-xs">عرض الشعار: {logoWidth}px</label>
              <input type="range" min={40} max={300} step={10} value={logoWidth} onChange={e => setLogoWidth(Number(e.target.value))} />
              <label className="text-xs mt-2">ارتفاع الشعار: {logoHeight}px</label>
              <input type="range" min={20} max={120} step={5} value={logoHeight} onChange={e => setLogoHeight(Number(e.target.value))} />
              <label className="flex items-center gap-2 mt-2 text-sm"><input type="checkbox" checked={showStoreName} onChange={e => setShowStoreName(e.target.checked)} /> عرض اسم المتجر بجانب الشعار</label>
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div className="col-span-2">
          <Label>فيفيكون المتجر</Label>
          <input type="file" accept="image/*" onChange={handleFaviconFile} className="mt-2" />
          {isUploadingFavicon && <div className="text-sm text-gray-500 mt-2">جاري رفع الفيفيكون...</div>}
          <div className="mt-2">
            { (faviconPreview || favicon) && !faviconError ? (
              <img src={faviconPreview ?? favicon ?? ''} alt="favicon" width={32} height={32} onError={() => setFaviconError(true)} />
            ) : (
              <div className="text-xs text-gray-500">معاينة الفيفيكون</div>
            )}
          </div>
        </div>

        {/* Colors */}
        <div>
          <Label>اللون الرئيسي — الأزرار والروابط</Label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="mt-1">
            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-12 h-10 rounded" />
            <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
          </div>
        </div>

        <div>
          <Label>اللون الثانوي — الخلفيات</Label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="mt-1">
            <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-12 h-10 rounded" />
            <Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} />
          </div>
        </div>

        <div>
          <Label>لون التمييز — النجوم والشارات</Label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="mt-1">
            <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-12 h-10 rounded" />
            <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} />
          </div>
        </div>

        {/* Font */}
        <div>
          <Label>الخط</Label>
          <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg">
            <option value="'Cairo', sans-serif">Cairo — عربي</option>
            <option value="'Tajawal', sans-serif">Tajawal — عربي</option>
            <option value="'Noto Sans Arabic', sans-serif">Noto Sans Arabic</option>
            <option value="'Inter', sans-serif">Inter — إنجليزي</option>
            <option value="'Poppins', sans-serif">Poppins — إنجليزي</option>
          </select>
          <div className="mt-3 p-3 border rounded" style={{ fontFamily }}>
            مرحباً بكم في متجرنا — Welcome
          </div>
        </div>

        {/* Border radius */}
        <div className="col-span-2">
          <Label>الزوايا</Label>
          <div className="flex gap-3 mt-2">
            {borderOptions.map(opt => (
              <button key={opt.value} onClick={() => setBorderRadius(opt.value)} className={`p-3 border ${borderRadius === opt.value ? 'ring-2 ring-offset-1' : ''}`}>
                <div style={{ width: 48, height: 24, borderRadius: opt.value, background: '#eee' }}></div>
                <div className="text-xs mt-1">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <div className="col-span-2">
          <Label>معاينة مباشرة</Label>
          <div className="mt-2 p-6" style={{ background: primaryColor, borderRadius, fontFamily }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {logo && !logoError ? (
                <img src={logo} alt="preview logo" width={logoWidth} height={logoHeight} style={{ objectFit: 'contain' }} onError={() => setLogoError(true)} />
              ) : (
                <div style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>{data?.store.name}</div>
              )}
              <button style={{ background: secondaryColor, color: 'white', padding: '8px 16px', borderRadius }} className="ml-auto">زر تجريبي</button>
            </div>
            <p className="text-white/70 mt-4">نص تجريبي يظهر بالخط المختار</p>
          </div>
        </div>

      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="bg-accent text-black hover:bg-accent/90">
          {isSaving ? 'جاري الحفظ...' : 'حفظ الهوية البصرية'}
        </Button>
      </div>
    </Card>
  );
};

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
          { name: "Modern Shop", price: "مجاني", popular: true },
          { name: "Minimal Store", price: "مجاني", popular: false },
          { name: "Fashion Pro", price: "299 ر.س", popular: true },
          { name: "Tech Store", price: "199 ر.س", popular: false },
          { name: "Food Market", price: "مجاني", popular: false },
          { name: "Sports Elite", price: "399 ر.س", popular: true },
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
