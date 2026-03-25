"use client";

import { useState } from "react";
import {
  Tag,
  TrendingUp,
  DollarSign,
  Clock,
  Plus,
  Edit,
  EyeOff,
  Eye,
  Trash2,
  Copy,
  Megaphone,
  Mail,
  MessageSquare,
  Facebook,
  BarChart3,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
  type Coupon,
} from "@/lib/services/couponsApi";
import CouponFormDialog from "./coupons/CouponFormDialog";
import { toast } from "sonner";

/* ─── Label Maps ─── */
const STATUS_LABELS: Record<string, string> = {
  all: "الكل",
  ACTIVE: "نشط",
  INACTIVE: "غير نشط",
  EXPIRED: "منتهي",
  DEPLETED: "مُستنفد",
};

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: "نسبة مئوية",
  FIXED_AMOUNT: "مبلغ ثابت",
  FREE_SHIPPING: "شحن مجاني",
  FREE_PRODUCT: "منتج مجاني",
  PRODUCT_DISCOUNT: "خصم منتجات",
};

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    ACTIVE: "bg-primary/10 text-primary border-primary/20",
    INACTIVE: "bg-muted text-muted-foreground border-border",
    EXPIRED:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    DEPLETED: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls[status] ?? cls.INACTIVE}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Format helpers ─── */
function formatDiscount(coupon: Coupon): string {
  switch (coupon.type) {
    case "PERCENTAGE":
    case "PRODUCT_DISCOUNT":
      return `${coupon.discountValue}%`;
    case "FIXED_AMOUNT":
      return `${coupon.discountValue?.toLocaleString("ar-SA")} ر.س`;
    case "FREE_SHIPPING":
      return "شحن مجاني";
    case "FREE_PRODUCT":
      return "منتج مجاني";
    default:
      return "—";
  }
}

function formatCurrency(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M ر.س`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ر.س`;
  return `${v.toLocaleString("ar-SA")} ر.س`;
}

/* ─── Copy Button ─── */
function CopyButton({ value }: { value: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success("تم نسخ الكود");
      }}
      className="p-1 rounded hover:bg-muted transition-colors"
      title="نسخ الكود"
      type="button"
    >
      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

/* ─── Coming Soon Card ─── */
function ComingSoonCard({
  icon: Icon,
  title,
  description,
  features,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              قريباً
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground">{description}</p>
        <ul className="space-y-2">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <Button variant="outline" className="w-full mt-4" disabled>
          إشعاري عند الإطلاق
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── Coupons Tab ─── */
function CouponsTab() {
  const [filter, setFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const { data, isLoading } = useGetCouponsQuery({ status: filter, page: 1 });
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [toggleStatus] = useToggleCouponStatusMutation();

  const coupons = data?.coupons ?? [];
  const stats = data?.stats;

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowDialog(true);
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      await toggleStatus(coupon.id).unwrap();
      toast.success(
        coupon.status === "ACTIVE" ? "تم تعطيل الكوبون" : "تم تفعيل الكوبون",
      );
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id).unwrap();
      toast.success("تم حذف الكوبون");
    } catch {
      toast.error("حدث خطأ أثناء حذف الكوبون");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">كوبونات الخصم</h2>
          <p className="text-sm text-muted-foreground">
            أنشئ وأدر كوبونات الخصم لمتجرك
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCoupon(null);
            setShowDialog(true);
          }}
        >
          <Plus className="h-4 w-4 ms-2" />
          إنشاء كوبون
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="كوبونات نشطة"
              value={stats?.active ?? 0}
              icon={Tag}
            />
            <StatCard
              title="إجمالي الاستخدامات"
              value={stats?.totalUsages ?? 0}
              icon={TrendingUp}
            />
            <StatCard
              title="إجمالي الخصومات"
              value={formatCurrency(stats?.totalDiscount ?? 0)}
              icon={DollarSign}
            />
            <StatCard
              title="منتهية الصلاحية"
              value={stats?.expired ?? 0}
              icon={Clock}
            />
          </>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <Card className="overflow-hidden">
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      ) : coupons.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {filter === "all"
              ? "لا توجد كوبونات بعد"
              : `لا توجد كوبونات بحالة "${STATUS_LABELS[filter]}"`}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setEditingCoupon(null);
              setShowDialog(true);
            }}
          >
            <Plus className="h-4 w-4 ms-2" />
            أنشئ أول كوبون
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>الكود</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الخصم</TableHead>
                <TableHead>الاستخدام</TableHead>
                <TableHead>الانتهاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="w-28">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono border border-border">
                        {coupon.code}
                      </code>
                      <CopyButton value={coupon.code} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{coupon.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {TYPE_LABELS[coupon.type] ?? coupon.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDiscount(coupon)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {coupon.usageCount}
                    </span>
                    {coupon.maxUsageCount ? `/${coupon.maxUsageCount}` : ""}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString("ar-SA")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={coupon.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(coupon)}
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggle(coupon)}
                        title={coupon.status === "ACTIVE" ? "تعطيل" : "تفعيل"}
                      >
                        {coupon.status === "ACTIVE" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="حذف"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف الكوبون</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف كوبون &ldquo;{coupon.name}
                              &rdquo;؟
                              {coupon.usageCount > 0
                                ? " سيتم تعطيله بدلاً من الحذف لأنه مُستخدَم."
                                : " سيتم حذفه نهائياً."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(coupon.id)}
                            >
                              {coupon.usageCount > 0 ? "تعطيل" : "حذف"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <CouponFormDialog
        open={showDialog}
        onOpenChange={(v) => {
          setShowDialog(v);
          if (!v) setEditingCoupon(null);
        }}
        editingCoupon={editingCoupon}
      />
    </div>
  );
}

/* ─── Campaigns Tab (Coming Soon) ─── */
function CampaignsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">الحملات الإعلانية</h2>
        <p className="text-sm text-muted-foreground">
          أطلق حملاتك الإعلانية على جوجل وفيسبوك مباشرةً من لوحة التحكم
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComingSoonCard
          icon={Facebook}
          title="إعلانات فيسبوك وإنستغرام"
          description="أنشئ وأدر حملاتك الإعلانية على منصات Meta من مكان واحد مع تتبع دقيق للأداء."
          features={[
            "ربط فيسبوك بيكسل تلقائياً",
            "استهداف ذكي بناءً على سلوك المتسوقين",
            "تقارير أداء الإعلانات بالوقت الفعلي",
            "ميزانية ذكية وتحسين تلقائي",
          ]}
        />
        <ComingSoonCard
          icon={BarChart3}
          title="إعلانات جوجل"
          description="اظهر في أعلى نتائج البحث وعلى شبكة العرض الإعلانية لجوجل بإعداد مبسّط."
          features={[
            "ربط Google Ads تلقائياً",
            "حملات تسوّق Google Shopping",
            "إعادة استهداف الزوار السابقين",
            "تتبع التحويلات والمبيعات",
          ]}
        />
      </div>
    </div>
  );
}

/* ─── Email Tab (Coming Soon) ─── */
function EmailTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">البريد الإلكتروني</h2>
        <p className="text-sm text-muted-foreground">
          أرسل حملات بريدية مخصصة لعملائك لزيادة المبيعات والولاء
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComingSoonCard
          icon={Mail}
          title="حملات البريد الإلكتروني"
          description="أنشئ وأرسل حملات بريدية جميلة إلى قائمة عملائك مع قوالب جاهزة."
          features={[
            "قوالب بريدية احترافية جاهزة",
            "تقسيم العملاء حسب سلوك الشراء",
            "جدولة الإرسال في الوقت المناسب",
            "تقارير معدل الفتح والنقر",
          ]}
        />
        <ComingSoonCard
          icon={Zap}
          title="تدفقات التشغيل التلقائي"
          description="أعدّ رسائل تلقائية ترسل في المناسبات الصحيحة دون تدخل منك."
          features={[
            "رسائل ترحيب للعملاء الجدد",
            "استرداد السلة المهجورة",
            "تذكير بعد الشراء والمراجعات",
            "عروض عيد الميلاد والمناسبات",
          ]}
        />
      </div>
    </div>
  );
}

/* ─── SMS Tab (Coming Soon) ─── */
function SmsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">الرسائل النصية</h2>
        <p className="text-sm text-muted-foreground">
          تواصل مع عملائك مباشرةً عبر الرسائل القصيرة بمعدل قراءة يتجاوز 95٪
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComingSoonCard
          icon={MessageSquare}
          title="حملات SMS"
          description="أرسل رسائل نصية مخصصة لقائمة عملائك بأسعار تنافسية وتوصيل فوري."
          features={[
            "دعم الرسائل بالعربية بالكامل",
            "إرسال فوري أو مجدوَل",
            "تخصيص الاسم لكل عميل",
            "تقارير الإيصال والتفاعل",
          ]}
        />
        <ComingSoonCard
          icon={Zap}
          title="SMS التشغيل التلقائي"
          description="رسائل نصية تلقائية لاسترداد العملاء وإعادة تفعيل الطلبات المتروكة."
          features={[
            "رسالة استرداد السلة المهجورة",
            "إشعار حالة الطلب والشحن",
            "عروض حصرية للعملاء المميزين",
            "تأكيد الطلبات والفواتير",
          ]}
        />
      </div>
    </div>
  );
}

/* ─── Main Export ─── */
export default function Marketing() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          التسويق
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          أدوات تسويقية متكاملة لتنمية متجرك وزيادة مبيعاتك
        </p>
      </div>

      {/* 4-Tab Layout */}
      <Tabs defaultValue="coupons" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="coupons" className="gap-1.5">
            <Tag className="h-4 w-4" />
            الكوبونات
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="gap-1.5">
            <Megaphone className="h-4 w-4" />
            الحملات
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-1.5">
            <Mail className="h-4 w-4" />
            البريد
          </TabsTrigger>
          <TabsTrigger value="sms" className="gap-1.5">
            <MessageSquare className="h-4 w-4" />
            الرسائل
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <CouponsTab />
        </TabsContent>
        <TabsContent value="campaigns">
          <CampaignsTab />
        </TabsContent>
        <TabsContent value="email">
          <EmailTab />
        </TabsContent>
        <TabsContent value="sms">
          <SmsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
