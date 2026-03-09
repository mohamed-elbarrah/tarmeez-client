"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, ExternalLink, HelpCircle } from "lucide-react";

export default function PendingPage() {
    const [email, setEmail] = useState("بريدك الإلكتروني");
    const router = useRouter();

    useEffect(() => {
        const pendingData = localStorage.getItem('pending_merchant');
        if (pendingData) {
            const { email: savedEmail } = JSON.parse(pendingData);
            setEmail(savedEmail);
        }
    }, []);

    return (
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm text-center py-6">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-10 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 animate-pulse">
                        <Clock size={40} />
                    </div>
                </div>
                <CardTitle className="text-2xl">طلبك قيد المراجعة</CardTitle>
                <CardDescription className="text-base pt-2">
                    لقد تلقينا طلبك للانضمام إلى منصة ترميز.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-3 text-orange-800 dark:text-orange-300 mb-2 justify-center flex-row-reverse">
                        <Mail size={18} />
                        <span className="font-medium" dir="ltr">{email}</span>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-400">
                        سنقوم بإخطارك على هذا العنوان بمجرد قيام فريقنا بمراجعة تفاصيل متجرك (عادة خلال 24-48 ساعة).
                    </p>
                </div>

                <div className="text-sm text-muted-foreground">
                    <p>بينما تنتظر، يمكنك البدء في تجهيز قائمة منتجاتك أو الاطلاع على التوثيق الخاص بنا.</p>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
                <Button asChild className="w-full font-bold">
                    <Link href="/">العودة للرئيسية</Link>
                </Button>
                <div className="flex w-full gap-2">
                    <Button variant="outline" asChild className="flex-1">
                        <a href="mailto:support@platform.com">
                            تواصل معنا <Mail className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                        <Link href="#">
                            التعليمات <HelpCircle className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
