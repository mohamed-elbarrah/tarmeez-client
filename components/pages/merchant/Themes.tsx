import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Download } from "lucide-react";
import { useUpdateStoreCustomizationMutation } from '@/lib/services/productsApi';
import { useGetMyStoreQuery } from '@/lib/services/merchantApi';

const BrandIdentitySection = () => {
  const { data } = useGetMyStoreQuery();
  const [updateCustomization, { isLoading }] = useUpdateStoreCustomizationMutation();

  const [form, setForm] = useState({
    primaryColor: '#2563EB',
    secondaryColor: '#1E40AF',
    fontFamily: 'Inter',
    logo: '',
  });

  useEffect(() => {
    if (data?.store) {
      setForm({
        primaryColor: data.store.primaryColor ?? '#2563EB',
        secondaryColor: data.store.secondaryColor ?? '#1E40AF',
        fontFamily: data.store.fontFamily ?? 'Inter',
        logo: data.store.logo ?? '',
      });
    }
  }, [data]);

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-xl font-bold mb-6">الهوية البصرية</h2>
      <div className="grid grid-cols-2 gap-6">

        {/* Logo URL */}
        <div className="col-span-2">
          <Label>رابط الشعار</Label>
          <Input
            value={form.logo}
            onChange={e => setForm({ ...form, logo: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
          {form.logo && (
            <img src={form.logo} alt="logo preview"
              className="mt-2 h-12 object-contain" />
          )}
        </div>

        {/* Primary Color */}
        <div>
          <Label>اللون الأساسي</Label>
          <div className="flex gap-3 items-center mt-1">
            <input
              type="color"
              value={form.primaryColor}
              onChange={e => setForm({ ...form, primaryColor: e.target.value })}
              className="w-12 h-10 rounded cursor-pointer border border-border"
            />
            <Input
              value={form.primaryColor}
              onChange={e => setForm({ ...form, primaryColor: e.target.value })}
              className="font-mono"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <Label>اللون الثانوي</Label>
          <div className="flex gap-3 items-center mt-1">
            <input
              type="color"
              value={form.secondaryColor}
              onChange={e => setForm({ ...form, secondaryColor: e.target.value })}
              className="w-12 h-10 rounded cursor-pointer border border-border"
            />
            <Input
              value={form.secondaryColor}
              onChange={e => setForm({ ...form, secondaryColor: e.target.value })}
              className="font-mono"
            />
          </div>
        </div>

        {/* Font Family */}
        <div>
          <Label>الخط</Label>
          <select
            value={form.fontFamily}
            onChange={e => setForm({ ...form, fontFamily: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg"
          >
            <option value="Inter">Inter</option>
            <option value="Cairo">Cairo (عربي)</option>
            <option value="Tajawal">Tajawal (عربي)</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="DM Sans">DM Sans</option>
          </select>
        </div>

        {/* Preview */}
        <div>
          <Label>معاينة</Label>
          <div
            className="mt-1 p-4 rounded-lg border border-border"
            style={{
              backgroundColor: form.primaryColor,
              fontFamily: form.fontFamily,
            }}
          >
            <p className="text-white text-sm font-medium">
              معاينة الهوية البصرية
            </p>
            <p className="text-white/70 text-xs mt-1">
              {data?.store.name ?? 'اسم المتجر'}
            </p>
          </div>
        </div>

      </div>

      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => updateCustomization(form)}
          disabled={isLoading}
          className="bg-accent text-black hover:bg-accent/90"
        >
          {isLoading ? 'جاري الحفظ...' : 'حفظ الهوية البصرية'}
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
