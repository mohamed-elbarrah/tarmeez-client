"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCompleteInvitedRegistrationMutation } from "@/lib/services/authApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function CompleteRegistrationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [completeRegistration, { isLoading }] =
    useCompleteInvitedRegistrationMutation();

  useEffect(() => {
    document.title = "إكمال التسجيل | منصة ترميز";
  }, []);

  // Guard: if token is missing, redirect to home
  useEffect(() => {
    if (!token) router.replace("/");
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("الاسم الكامل مطلوب");
      return;
    }
    if (password.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      await completeRegistration({ token, fullName, password }).unwrap();
      router.push("/merchant");
    } catch (err: any) {
      const status = err?.status;
      const msg: string = err?.data?.message ?? "";

      if (status === 409) {
        setError("يوجد حساب مرتبط بهذا البريد الإلكتروني. يرجى تسجيل الدخول.");
      } else if (status === 400) {
        setError("رابط الدعوة غير صالح أو منتهي الصلاحية.");
      } else if (status === 404) {
        setError("لم يتم العثور على الدعوة. تحقق من الرابط.");
      } else if (status === "FETCH_ERROR") {
        setError("تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.");
      } else {
        setError(msg || "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
      }
    }
  };

  if (!token) return null;

  return (
    <Card className="  shadow-2xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">إكمال التسجيل</CardTitle>
        <CardDescription className="text-center">
          أنشئ كلمة مرورك للوصول إلى المتجر
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email — read-only, pre-filled from query param */}
          <div className="space-y-2 text-right">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              disabled
              className="bg-muted/50 text-right cursor-not-allowed"
            />
          </div>

          <div className="space-y-2 text-right">
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="أدخل اسمك الكامل"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-background/50 text-right"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2 text-right">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="8 أحرف على الأقل"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 text-right pe-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="أعد كتابة كلمة المرور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-background/50 text-right"
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 transition-all font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري إنشاء الحساب...
              </>
            ) : (
              "إنشاء الحساب والدخول"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
