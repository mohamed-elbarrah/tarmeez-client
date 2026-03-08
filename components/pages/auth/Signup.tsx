import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-accent font-bold text-xl">ت</span>
            </div>
            <span className="text-2xl font-bold">ترميز</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">ابدأ مجاناً</h1>
          <p className="text-muted-foreground">أنشئ حسابك وابدأ متجرك في دقائق</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" type="text" placeholder="أحمد محمد" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store">اسم المتجر</Label>
              <Input id="store" type="text" placeholder="متجري" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" />
              <span>أوافق على <a href="#" className="text-accent hover:underline">الشروط والأحكام</a></span>
            </div>
            <Link href="/merchant">
              <Button className="w-full bg-accent text-black hover:bg-accent/90">
                إنشاء الحساب
              </Button>
            </Link>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-accent hover:underline font-medium">
              سجل دخولك
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
