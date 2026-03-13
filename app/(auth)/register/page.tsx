"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { MerchantRegisterFormData } from "@/lib/types/auth";
import { useMerchantRegisterMutation } from '@/lib/services/authApi'

const categories = [
    { label: "أزياء", value: "Fashion" },
    { label: "إلكترونيات", value: "Electronics" },
    { label: "أغذية ومشروبات", value: "Food & Beverage" },
    { label: "صحة وتجميل", value: "Health & Beauty" },
    { label: "أدوات منزلية", value: "Home & Living" },
    { label: "رياضة", value: "Sports" },
    { label: "أخرى", value: "Other" }
];

const countries = [
    { label: "المملكة العربية السعودية", value: "Saudi Arabia" },
    { label: "الإمارات العربية المتحدة", value: "United Arab Emirates" },
    { label: "مصر", value: "Egypt" },
    { label: "الأردن", value: "Jordan" },
    { label: "الكويت", value: "Kuwait" },
    { label: "قطر", value: "Qatar" },
    { label: "عمان", value: "Oman" },
    { label: "البحرين", value: "Bahrain" }
];

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [merchantRegister, { isLoading: isSubmitting }] = useMerchantRegisterMutation()
    const [formData, setFormData] = useState<MerchantRegisterFormData>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        storeName: "",
        category: "",
        country: "",
        city: "",
        description: "",
        agreedToTerms: false
    });

    const [errors, setErrors] = useState<Partial<Record<keyof MerchantRegisterFormData, string>>>({});
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id as keyof MerchantRegisterFormData]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id as keyof MerchantRegisterFormData]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const validateStep1 = () => {
        const newErrors: Partial<Record<keyof MerchantRegisterFormData, string>> = {};
        if (!formData.fullName) newErrors.fullName = "الاسم الكامل مطلوب";
        if (!formData.email) newErrors.email = "البريد الإلكتروني مطلوب";
        if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
        else if (formData.password.length < 8) newErrors.password = "يجب أن تكون 8 أحرف على الأقل";
        if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "كلمات المرور غير متطابقة";
        if (!formData.phone) newErrors.phone = "رقم الهاتف مطلوب";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Partial<Record<keyof MerchantRegisterFormData, string>> = {};
        if (!formData.storeName) newErrors.storeName = "اسم المتجر مطلوب";
        if (!formData.category) newErrors.category = "الفئة مطلوبة";
        if (!formData.country) newErrors.country = "الدولة مطلوبة";
        if (!formData.city) newErrors.city = "المدينة مطلوبة";
        if (!formData.agreedToTerms) newErrors.agreedToTerms = "يجب الموافقة على الشروط والأحكام";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep1()) setStep(2);
    };

    const prevStep = () => setStep(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setErrors({})
        try {
            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                storeName: formData.storeName,
                category: formData.category,
                country: formData.country,
                city: formData.city,
                description: formData.description || undefined,
            }

            const result = await merchantRegister(payload).unwrap()
            // redirect in component after successful registration
            router.push(`/auth/pending?email=${encodeURIComponent(result.user.email)}`)
        } catch (err: any) {
            const status = err?.status
            const data = err?.data

            if (status === 'FETCH_ERROR') {
                setErrors({ email: 'تعذر الاتصال بالخادم' })
            } else if (typeof data?.message === 'string') {
                const msg = data.message.toLowerCase()
                if (msg.includes('store') && (msg.includes('taken') || msg.includes('exists') || msg.includes('محجوز'))) {
                    setErrors({ storeName: 'اسم المتجر محجوز، جرب اسماً آخر' })
                } else if (msg.includes('email') && (msg.includes('taken') || msg.includes('exists') || msg.includes('مستخدم'))) {
                    setErrors({ email: 'البريد الإلكتروني مستخدم بالفعل' })
                } else {
                    setErrors({ email: data.message })
                }
            } else {
                setErrors({ email: 'حدث خطأ أثناء التقديم' })
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm w-full max-w-lg mx-auto text-right">
            <CardHeader>
                <div className="flex justify-between items-center mb-2 flex-row-reverse">
                    <CardTitle className="text-2xl">فتح متجر جديد</CardTitle>
                    <div className="flex gap-1 flex-row-reverse">
                        <div className={`h-2 w-8 rounded-full ${step === 1 ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`h-2 w-8 rounded-full ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
                    </div>
                </div>
                <CardDescription>
                    {step === 1 ? "الخطوة 1: المعلومات الشخصية" : "الخطوة 2: معلومات المتجر"}
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {step === 1 ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">الاسم الكامل</Label>
                                <Input id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="أحمد علي" className={`text-right ${errors.fullName ? "border-destructive" : ""}`} />
                                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" dir="ltr" className={`text-right ${errors.email ? "border-destructive" : ""}`} />
                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
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
                                <Label htmlFor="phone">رقم الهاتف</Label>
                                <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+966 50 123 4567" dir="ltr" className={`text-right ${errors.phone ? "border-destructive" : ""}`} />
                                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="storeName">اسم المتجر</Label>
                                <Input id="storeName" value={formData.storeName} onChange={handleInputChange} placeholder="متجري المتميز" className={`text-right ${errors.storeName ? "border-destructive" : ""}`} />
                                {errors.storeName && <p className="text-xs text-destructive">{errors.storeName}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">الفئة</Label>
                                    <Select onValueChange={(v) => handleSelectChange("category", v)} value={formData.category}>
                                        <SelectTrigger className={`flex-row-reverse text-right ${errors.category ? "border-destructive" : ""}`}>
                                            <SelectValue placeholder="اختر الفئة" />
                                        </SelectTrigger>
                                        <SelectContent align="end">
                                            {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">الدولة</Label>
                                    <Select onValueChange={(v) => handleSelectChange("country", v)} value={formData.country}>
                                        <SelectTrigger className={`flex-row-reverse text-right ${errors.country ? "border-destructive" : ""}`}>
                                            <SelectValue placeholder="اختر الدولة" />
                                        </SelectTrigger>
                                        <SelectContent align="end">
                                            {countries.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">المدينة</Label>
                                <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="الرياض" className={`text-right ${errors.city ? "border-destructive" : ""}`} />
                                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">وصف المتجر (اختياري)</Label>
                                <Textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="أخبرنا عن منتجاتك..." className="max-h-32 text-right" maxLength={300} />
                                <div className="text-[10px] text-left text-muted-foreground">{formData.description?.length}/300</div>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse pt-2 justify-start">
                                <Checkbox
                                    id="agreedToTerms"
                                    checked={formData.agreedToTerms}
                                    onCheckedChange={(checked) => handleSelectChange("agreedToTerms", checked as any)}
                                />
                                <Label htmlFor="agreedToTerms" className="text-xs font-medium leading-none cursor-pointer">
                                    أوافق على <Link href="#" className="underline text-primary">الشروط والأحكام</Link> وسياسة معالجة البيانات
                                </Label>
                            </div>
                            {errors.agreedToTerms && <p className="text-xs text-destructive">{errors.agreedToTerms}</p>}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex gap-3 flex-row-reverse">
                    {step === 1 ? (
                        <Button type="button" className="w-full font-bold" onClick={nextStep}>
                            الخطوة التالية <ArrowLeft className="mr-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <>
                            <Button type="submit" className="flex-[2] font-bold" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري التقديم...
                                    </>
                                ) : (
                                    <>
                                        تقديم الطلب <CheckCircle2 className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            <Button type="button" variant="outline" className="flex-1" onClick={prevStep} disabled={isLoading}>
                                السابق
                            </Button>
                        </>
                    )}
                </CardFooter>
            </form>

            <div className="pb-6 text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                    تسجيل الدخول
                </Link>
            </div>
        </Card>
    );
}
