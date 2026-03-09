"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useStoreAuth } from "@/hooks/use-store-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StoreLoginPage() {
    const params = useParams();
    const storeSlug = params.storeSlug as string;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, isLoading } = useStoreAuth(storeSlug);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("يرجى ملء جميع الحقول");
            return;
        }

        try {
            await login(email, password);
            router.push(`/store/${storeSlug}/account`);
        } catch (err: any) {
            if (err.message === "Invalid email or password") {
                setError("بيانات الدخول غير صحيحة لهذا المتجر.");
            } else {
                setError(err.message || "حدث خطأ أثناء تسجيل الدخول.");
            }
        }
    };

    return (
        <Card className="border shadow-lg text-right">
            <CardHeader>
                <CardTitle className="text-xl">تسجيل دخول العملاء</CardTitle>
                <CardDescription>
                    قم بتسجيل الدخول إلى حسابك لإدارة طلباتك
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

                    <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="customer@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-right"
                            dir="ltr"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between flex-row-reverse">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Link
                                href="#"
                                className="text-xs text-primary hover:underline"
                            >
                                نسيت؟
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-right"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse justify-start">
                        <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <Label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none cursor-pointer"
                        >
                            تذكرني
                        </Label>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full font-bold"
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
                        عميل جديد؟{" "}
                        <Link
                            href={`/store/${storeSlug}/register`}
                            className="text-primary font-semibold hover:underline"
                        >
                            إنشاء حساب
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
