import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "ساعة كلاسيكية فاخرة",
      price: 1299,
      quantity: 1,
      size: "M",
      color: "أسود",
      image: "https://images.unsplash.com/photo-1760532467646-b9e466403862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwd2F0Y2glMjBsdXh1cnl8ZW58MXx8fHwxNzcyODYwMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      slug: "luxury-watch",
    },
    {
      id: 2,
      name: "حذاء رياضي عصري",
      price: 599,
      quantity: 2,
      size: "L",
      color: "أبيض",
      image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyODYwMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      slug: "sport-sneakers",
    },
    {
      id: 3,
      name: "نظارة شمسية مصمّمة",
      price: 899,
      quantity: 1,
      size: "واحد",
      color: "ذهبي",
      image: "https://images.unsplash.com/photo-1759933253608-ba60cfb8dcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXMlMjBsdXh1cnl8ZW58MXx8fHwxNzcyNzg0NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      slug: "designer-sunglasses",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 25;
  const discount = 0;
  const total = subtotal + shipping - discount;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center" dir="rtl">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">سلة التسوق فارغة</h1>
          <p className="text-muted-foreground mb-8">
            لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
          </p>
          <Link href="/store/collection/all">
            <Button size="lg">تصفح المنتجات</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" dir="rtl">
      <h1 className="text-4xl font-bold mb-8">سلة التسوق</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="divide-y divide-border">
            {cartItems.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    href={`/store/product/${item.slug}`}
                    className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <Link href={`/store/product/${item.slug}`}>
                        <h3 className="font-bold text-lg hover:text-accent transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground mb-4">
                      <p>المقاس: {item.size}</p>
                      <p>اللون: {item.color}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-left">
                        <p className="font-bold text-lg">
                          {(item.price * item.quantity).toLocaleString()} ر.س
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString()} ر.س للقطعة
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link href="/store/collection/all">
              <Button variant="outline">متابعة التسوق</Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>

            {/* Coupon Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                كود الخصم
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="أدخل كود الخصم"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline">تطبيق</Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-medium">
                  {subtotal.toLocaleString()} ر.س
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الشحن</span>
                {shipping === 0 ? (
                  <span className="text-accent font-medium">مجاني</span>
                ) : (
                  <span className="font-medium">{shipping} ر.س</span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الخصم</span>
                  <span className="text-accent font-medium">
                    -{discount.toLocaleString()} ر.س
                  </span>
                </div>
              )}
            </div>

            {/* Shipping Notice */}
            {shipping > 0 && (
              <div className="bg-secondary p-4 rounded-lg mb-6 text-sm">
                <p className="text-muted-foreground">
                  أضف منتجات بقيمة{" "}
                  <span className="font-bold text-foreground">
                    {(200 - subtotal).toLocaleString()} ر.س
                  </span>{" "}
                  للحصول على شحن مجاني
                </p>
              </div>
            )}

            <Separator className="my-6" />

            {/* Total */}
            <div className="flex justify-between mb-6">
              <span className="text-xl font-bold">المجموع</span>
              <span className="text-2xl font-bold">
                {total.toLocaleString()} ر.س
              </span>
            </div>

            {/* Checkout Button */}
            <Link href="/store/checkout">
              <Button size="lg" className="w-full">
                إتمام الطلب
              </Button>
            </Link>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                طرق الدفع المتاحة
              </p>
              <div className="flex gap-2">
                <div className="px-3 py-2 border border-border rounded text-xs">
                  Visa
                </div>
                <div className="px-3 py-2 border border-border rounded text-xs">
                  Mastercard
                </div>
                <div className="px-3 py-2 border border-border rounded text-xs">
                  مدى
                </div>
                <div className="px-3 py-2 border border-border rounded text-xs">
                  Apple Pay
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
