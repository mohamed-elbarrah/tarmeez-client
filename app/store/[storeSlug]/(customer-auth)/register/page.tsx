"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus } from "lucide-react";
import { CustomerRegisterFormData, MockCustomer } from "@/lib/types/auth";

export default function StoreRegisterPage() {
    const params = useParams();
    const storeSlug = params.storeSlug as string;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CustomerRegisterFormData>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        agreedToTerms: false
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CustomerRegisterFormData, string>>>({});
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id as keyof CustomerRegisterFormData]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, agreedToTerms: checked }));
        if (errors.agreedToTerms) {
            setErrors(prev => ({ ...prev, agreedToTerms: undefined }));
        }
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof CustomerRegisterFormData, string>> = {};
        if (!formData.fullName) newErrors.fullName = "الاسم الكامل مطلوب";
        if (!formData.email) newErrors.email = "البريد الإلكتروني مطلوب";
        if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
        else if (formData.password.length < 8) newErrors.password = "يجب أن تكون 8 أحرف على الأقل";
        if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "كلمات المرور غير متطابقة";
        if (!formData.agreedToTerms) newErrors.agreedToTerms = "يجب الموافقة على الشروط والأحكام";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Save to localStorage
        const localCustomersStr = localStorage.getItem(`customers_${storeSlug}`);
        const localCustomers: MockCustomer[] = localCustomersStr ? JSON.parse(localCustomersStr) : [];

        const newCustomer: MockCustomer = {
            storeSlug,
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            createdAt: Date.now()
        };

        localCustomers.push(newCustomer);
        localStorage.setItem(`customers_${storeSlug}`, JSON.stringify(localCustomers));

        // Auto login
        localStorage.setItem(`store_user_${storeSlug}`, JSON.stringify(newCustomer));

        setIsLoading(false);
        router.push(`/store/${storeSlug}/account`);
    };

    return (
        <Card className="border shadow-lg text-right">
            <CardHeader>
                <CardTitle className="text-xl">إنشاء حساب جديد</CardTitle>
                <CardDescription>
                    انضم إلينا واستمتع بتجربة تسوق أسرع
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">الاسم الكامل</Label>
                        <Input id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="محمد أحمد" className={`text-right ${errors.fullName ? "border-destructive" : ""}`} />
                        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" dir="ltr" className={`text-right ${errors.email ? "border-destructive" : ""}`} />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                            <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className={`text-right ${errors.confirmPassword ? "border-destructive" : ""}`} />
                            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input id="password" type="password" value={formData.password} onChange={handleInputChange} className={`text-right ${errors.password ? "border-destructive" : ""}`} />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                        <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+966 50 123 4567" dir="ltr" className="text-right" />
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse pt-2 justify-start">
                        <Checkbox
                            id="agreedToTerms"
                            checked={formData.agreedToTerms}
                            onCheckedChange={handleCheckboxChange}
                        />
                        <Label htmlFor="agreedToTerms" className="text-xs font-medium leading-none cursor-pointer">
                            أوافق على <Link href="#" className="underline text-primary">الشروط والأحكام</Link>
                        </Label>
                    </div>
                    {errors.agreedToTerms && <p className="text-xs text-destructive">{errors.agreedToTerms}</p>}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري إنشاء الحساب...
                            </>
                        ) : (
                            <>
                                <UserPlus className="ml-2 h-4 w-4" /> إنشاء الحساب
                            </>
                        )}
                    </Button>

                    <div className="text-sm text-center text-muted-foreground">
                        لديك حساب بالفعل؟{" "}
                        <Link href={`/store/${storeSlug}/login`} className="text-primary font-semibold hover:underline">
                            تسجيل الدخول
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
