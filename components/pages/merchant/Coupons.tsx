"use client";
import { useState } from "react";
import {
  Plus,
  Tag,
  TrendingUp,
  DollarSign,
  Clock,
  Edit,
  EyeOff,
  Eye,
  Trash2,
  Copy,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
  type Coupon,
} from "@/lib/services/couponsApi";
import CouponFormDialog from "./coupons/CouponFormDialog";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  all: "الكل",
  ACTIVE: "نشط",
  INACTIVE: "غير نشط",
  EXPIRED: "منتهي",
  DEPLETED: "مُستنفد",
};

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: "خصم نسبة مئوية",
  FIXED_AMOUNT: "خصم مبلغ ثابت",
  FREE_SHIPPING: "شحن مجاني",
  FREE_PRODUCT: "منتج مجاني",
  PRODUCT_DISCOUNT: "خصم على منتجات",
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    INACTIVE: "bg-muted text-muted-foreground",
    EXPIRED:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    DEPLETED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.INACTIVE}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

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
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function CopyButton({ value }: { value: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success("تم نسخ الكود");
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-muted transition-colors"
      title="نسخ الكود"
    >
      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

function formatDiscount(coupon: Coupon) {
  switch (coupon.type) {
    case "PERCENTAGE":
      return `${coupon.discountValue}%`;
    case "FIXED_AMOUNT":
      return `${coupon.discountValue} ر.س`;
    case "FREE_SHIPPING":
      return "شحن مجاني";
    case "FREE_PRODUCT":
      return "منتج مجاني";
    case "PRODUCT_DISCOUNT":
      return `${coupon.discountValue}%`;
    default:
      return "—";
  }
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ر.س`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K ر.س`;
  return `${value} ر.س`;
}

export default function Coupons() {
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const { data, isLoading } = useGetCouponsQuery({ status: filter, page: 1 });
  const [deleteCoupon] = useDeleteCouponMutation();
  const [toggleStatus] = useToggleCouponStatusMutation();

  const coupons = data?.coupons ?? [];
  const stats = data?.stats;

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowCreate(true);
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
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            الكوبونات والخصومات
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            أنشئ وأدر كوبونات الخصم لمتجرك
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCoupon(null);
            setShowCreate(true);
          }}
        >
          <Plus className="h-4 w-4 ms-2" />
          إنشاء كوبون
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="كوبونات نشطة" value={stats?.active ?? 0} icon={Tag} />
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
      </div>

      {/* Filter tabs */}
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
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : coupons.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">لا توجد كوبونات بعد</p>
          <Button
            variant="outline"
            onClick={() => {
              setEditingCoupon(null);
              setShowCreate(true);
            }}
          >
            <Plus className="w-4 h-4 ms-2" />
            أنشئ أول كوبون
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
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
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono">
                        {coupon.code}
                      </code>
                      <CopyButton value={coupon.code} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{coupon.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {TYPE_LABELS[coupon.type] || coupon.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDiscount(coupon)}</TableCell>
                  <TableCell>
                    {coupon.usageCount}
                    {coupon.maxUsageCount ? `/${coupon.maxUsageCount}` : ""}
                  </TableCell>
                  <TableCell>
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString(
                          "ar-SA-u-nu-latn",
                        )
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={coupon.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
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
                                ? " سيتم تعطيله بدلاً من حذفه لأنه مُستخدَم."
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

      {/* Create/Edit Dialog */}
      <CouponFormDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        editingCoupon={editingCoupon}
      />
    </div>
  );
}
