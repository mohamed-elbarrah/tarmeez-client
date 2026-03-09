"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, isLoading } = usePlatformAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("يرجى ملء جميع الحقول");
            return;
        }

        try {
            const user = await login(email, password);

            // Redirect logic
            if (user.role === 'superadmin') {
                router.push('/superadmin');
            } else if (user.role === 'merchant') {
                if (user.status === 'active') {
                    router.push('/merchant');
                } else if (user.status === 'pending') {
                    router.push('/pending');
                }
            }
        } catch (err: any) {
            // Handle known error messages in Arabic or keep as is if they are from hook
            if (err.message === "Your account has been rejected. Contact support.") {
                setError("تم رفض حسابك. يرجى الاتصال بالدعم.");
            } else if (err.message === "Invalid email or password") {
                setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
            } else {
                setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
            }
        }
    };

    return (
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
                <CardDescription className="text-center">
                    أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم
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

                    <div className="space-y-2 text-right">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-background/50 text-right"
                            required
                        />
                    </div>

                    <div className="space-y-2 text-right">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Link
                                href="#"
                                className="text-xs text-primary hover:underline"
                            >
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-background/50 text-right"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse justify-end">
                        <Label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-0"
                        >
                            تذكرني
                        </Label>
                        <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 transition-all font-bold"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جاري تسجيل الدخول...
                            </>
                        ) : (
                            "تسجيل الدخول"
                        )}
                    </Button>

                    <div className="text-sm text-center text-muted-foreground">
                        ليس لديك حساب؟{" "}
                        <Link
                            href="/register"
                            className="text-primary font-semibold hover:underline"
                        >
                            قدم طلب لفتح متجر
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
