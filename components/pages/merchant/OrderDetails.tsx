import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Printer, 
  Package, 
  Mail, 
  Phone, 
  MapPin, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  AlertCircle
} from "lucide-react";
import { useGetOrderByCodeQuery, useUpdateOrderStatusMutation } from "@/lib/services/merchantApi";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner is used for notifications based on common patterns

const statusConfig: Record<string, { label: string, color: string, icon: any, description: string }> = {
  PENDING: { label: "قيد الانتظار", color: "text-yellow-600 bg-yellow-50", icon: Clock, description: "تم استلام الطلب من العميل" },
  CONFIRMED: { label: "مؤكد", color: "text-blue-600 bg-blue-50", icon: CheckCircle2, description: "تم تأكيد الطلب" },
  PROCESSING: { label: "قيد التحضير", color: "text-orange-600 bg-orange-50", icon: Package, description: "بدأ تحضير الطلب" },
  SHIPPED: { label: "تم الشحن", color: "text-purple-600 bg-purple-50", icon: Truck, description: "الطلب في طريقه للعميل" },
  DELIVERED: { label: "تم التوصيل", color: "text-green-600 bg-green-50", icon: CheckCircle2, description: "تم تسليم الطلب للعميل" },
  CANCELLED: { label: "ملغي", color: "text-red-600 bg-red-50", icon: XCircle, description: "تم إلغاء الطلب" },
  REFUNDED: { label: "مسترجع", color: "text-muted-foreground bg-muted", icon: AlertCircle, description: "تم استرجاع الطلب" },
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}، ${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() >= 12 ? 'م' : 'ص'}`;
};

export default function OrderDetails() {
  const params = useParams();
  const orderCode = params.id as string;
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: order, isLoading, isError } = useGetOrderByCodeQuery(orderCode);
  const [updateStatus] = useUpdateOrderStatusMutation();

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await updateStatus({ orderCode, status: newStatus }).unwrap();
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      toast.error("فشل تحديث حالة الطلب");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-8 text-center bg-card rounded-xl border">
        <h2 className="text-xl font-bold mb-2">عذراً، لم يتم العثور على الطلب</h2>
        <Link href="/merchant/orders">
          <Button variant="link">العودة لقائمة الطلبات</Button>
        </Link>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status] || { label: order.status, color: "bg-muted", icon: Clock, description: "" };

  // Define next logical status for the button
  const nextStatuses: Record<string, string> = {
    PENDING: "CONFIRMED",
    CONFIRMED: "PROCESSING",
    PROCESSING: "SHIPPED",
    SHIPPED: "DELIVERED",
  };
  const nextStatus = nextStatuses[order.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/merchant/orders">
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">طلب #{order.orderCode}</h1>
            <p className="text-muted-foreground">تم الطلب في {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 ml-2" />
            طباعة
          </Button>
          {nextStatus && (
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => handleStatusUpdate(nextStatus)}
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              تحديث إلى {statusConfig[nextStatus].label}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="col-span-2 space-y-6">
          {/* Items */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">المنتجات</h3>
            <div className="space-y-4">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2 pb-4 border-b border-border last:border-0">
                  <div className="w-16 h-16 bg-secondary rounded-lg border border-border overflow-hidden flex items-center justify-center">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">الكمية: {item.quantity}</div>
                  </div>
                  <div className="text-left font-medium">
                    {Number(item.price).toLocaleString()} ر.س
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span>{Number(order.subtotal).toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الشحن</span>
                <span>{Number(order.shippingCost).toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>الإجمالي</span>
                <span>{Number(order.total).toLocaleString()} ر.س</span>
              </div>
            </div>
          </Card>

          {/* Timeline - Derived from status */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">سجل الطلب</h3>
            <div className="space-y-4">
              {/* This is a simplified timeline based on current status. 
                  In a real app, you'd have an OrderLogs table. 
                  For now, we indicate the current status and previous steps as completed. */}
              {Object.keys(statusConfig).filter(s => {
                   // Filter statuses to show progress up to current status
                   const orderList = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
                   const currentIndex = orderList.indexOf(order.status);
                   if (currentIndex === -1) return s === order.status; // Show single if cancelled/refunded
                   return orderList.indexOf(s) <= currentIndex && orderList.indexOf(s) !== -1;
              }).reverse().map((statusKey, i) => {
                const config = statusConfig[statusKey];
                return (
                  <div key={i} className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-accent" : "bg-secondary"}`}></div>
                      {i < 4 && <div className="w-0.5 h-12 bg-secondary"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium mb-1">{config.label}</div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {i === 0 ? formatDate(order.updatedAt) : ""}
                      </div>
                      <div className="text-sm">{config.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">معلومات العميل</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">الاسم</div>
                <div className="font-medium">{order.customerName}</div>
              </div>
              {order.customerEmail && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${order.customerEmail}`} className="text-accent hover:underline">{order.customerEmail}</a>
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">الهاتف</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${order.customerPhone}`} className="text-accent hover:underline">{order.customerPhone}</a>
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">عنوان الشحن</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <div className="font-medium mb-1">{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.shippingStreet}<br />
                    {order.shippingBuilding && `${order.shippingBuilding}, `}{order.shippingRegion}<br />
                    {order.shippingCity}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="text-sm text-muted-foreground mb-1">طريقة التوصيل</div>
                <div className="font-medium">شحن سريع</div>
                {order.transactionId && <div className="text-sm text-accent mt-1">رقم المعاملة: {order.transactionId}</div>}
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">معلومات الدفع</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">طريقة الدفع</div>
                <div className="font-medium">
                  {order.paymentMethod === "cash_on_delivery" ? "الدفع عند الاستلام" : order.paymentMethod}
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="text-sm text-muted-foreground mb-1">حالة الدفع</div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === "PAID" ? "bg-accent/10 text-accent-foreground" : 
                  order.paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {order.paymentStatus === "PAID" ? "مدفوع" : order.paymentStatus === "PENDING" ? "قيد الانتظار" : "فشل"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
