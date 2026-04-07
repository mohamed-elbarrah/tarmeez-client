"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useAcceptInvitationMutation,
  type StoreRole,
} from "@/lib/services/teamApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PageState = "loading" | "success" | "error";

interface AcceptResult {
  storeName: string;
  role: StoreRole;
  userExists: boolean;
}

// ─── Role label map ───────────────────────────────────────────────────────────

const ROLE_LABELS: Record<StoreRole, string> = {
  OWNER: "مالك",
  ADMIN: "مدير",
  EDITOR: "محرر",
  MARKETER: "مسوّق",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [pageState, setPageState] = useState<PageState>("loading");
  const [result, setResult] = useState<AcceptResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [acceptInvitation] = useAcceptInvitationMutation();

  // Prevent double-fire in React Strict Mode
  const called = useRef(false);

  useEffect(() => {
    document.title = "قبول الدعوة | منصة ترميز";
  }, []);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!token) {
      setErrorMessage("رابط الدعوة غير صالح أو مفقود.");
      setPageState("error");
      return;
    }

    acceptInvitation({ token })
      .unwrap()
      .then((data) => {
        setResult({
          storeName: data.storeName,
          role: data.role,
          userExists: data.userExists,
        });
        setPageState("success");

        if (data.userExists) {
          // Existing platform user — just needs to log in
          const timer = setTimeout(
            () =>
              router.replace(
                "/login?message=invitation-accepted&store=" +
                  encodeURIComponent(data.storeName),
              ),
            3000,
          );
          return () => clearTimeout(timer);
        } else {
          // New user — redirect to complete registration with token + email
          const timer = setTimeout(
            () =>
              router.replace(
                "/register/complete?token=" +
                  encodeURIComponent(token) +
                  "&email=" +
                  encodeURIComponent(data.email ?? ""),
              ),
            3000,
          );
          return () => clearTimeout(timer);
        }
      })
      .catch((err: { status?: number; data?: { message?: string } }) => {
        const msg = err?.data?.message ?? "";
        if (msg.toLowerCase().includes("expired")) {
          setErrorMessage(
            "انتهت صلاحية رابط الدعوة. يرجى طلب دعوة جديدة من صاحب المتجر.",
          );
        } else if (msg.toLowerCase().includes("already been accepted")) {
          setErrorMessage(
            "تم قبول هذه الدعوة مسبقاً. يمكنك تسجيل الدخول مباشرةً.",
          );
        } else if (msg.toLowerCase().includes("not found")) {
          setErrorMessage(
            "رابط الدعوة غير صالح. تحقق من الرابط أو اطلب دعوة جديدة.",
          );
        } else {
          setErrorMessage(
            "حدث خطأ أثناء معالجة الدعوة. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.",
          );
        }
        setPageState("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Card className="  shadow-2xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">قبول الدعوة</CardTitle>
        <CardDescription className="text-center">
          {pageState === "loading" && "جاري التحقق من دعوتك..."}
          {pageState === "success" && `أهلاً بك في متجر ${result?.storeName}`}
          {pageState === "error" && "تعذّر قبول الدعوة"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 pt-2 pb-8 px-8">
        {pageState === "loading" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="h-14 w-14 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm text-center">
              جاري التحقق من دعوتك، يرجى الانتظار...
            </p>
          </div>
        )}

        {pageState === "success" && result && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="rounded-full bg-green-500/10 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg">تم قبول الدعوة بنجاح!</p>
              <p className="text-muted-foreground text-sm">
                أنت الآن{" "}
                <span className="text-foreground font-medium">
                  {ROLE_LABELS[result.role]}
                </span>{" "}
                في متجر{" "}
                <span className="text-foreground font-medium">
                  {result.storeName}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>
                {result.userExists
                  ? "جاري تحويلك إلى صفحة تسجيل الدخول..."
                  : "جاري تحويلك لإكمال إنشاء حسابك..."}
              </span>
            </div>
          </div>
        )}

        {pageState === "error" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center w-full">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg">رابط غير صالح</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/")}
              >
                العودة للصفحة الرئيسية
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => router.push("/login")}
              >
                تسجيل الدخول
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
