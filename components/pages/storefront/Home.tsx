import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function StorefrontHome({ store }: { store?: any }) {
  const featuredProducts = store?.products || [];
  const storeUrl = store ? `/store/${store.slug}` : "/store";
  const storeName = store?.name || "متجري";

  const collections = [
    { name: "الجديد", slug: "new", count: featuredProducts.length },
    { name: "الأكثر مبيعاً", slug: "bestsellers", count: 0 },
    { name: "التخفيضات", slug: "sale", count: 0 },
    { name: "الإكسسوارات", slug: "accessories", count: 0 },
  ];

  return (
    <div dir="rtl">
      {/* Hero Section */}
      <section className="bg-secondary py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                مرحباً بكم في {storeName}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                اكتشف مجموعتنا الحصرية من المنتجات العصرية المصممة خصيصاً لك.
              </p>
              <div className="flex gap-4">
                <Link href={`${storeUrl}/collection/all`}>
                  <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    تسوق الآن
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href={`${storeUrl}/collection/all`}>
                  <Button size="lg" variant="outline">
                    جميع المنتجات
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg border border-border">
              <ImageWithFallback
                src={featuredProducts[0]?.images[0] || "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibGFja3xlbnwxfHx8fDE3NzI3ODM3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                alt={storeName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">تسوق حسب الفئة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.map((collection) => (
              <Link href={`${storeUrl}/collection/${collection.slug}`} key={collection.slug}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border border-border">
                  <h3 className="text-xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-muted-foreground">{collection.count} منتج</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">المنتجات المميزة</h2>
            <Link href={`${storeUrl}/collection/all`}>
              <Button variant="ghost" className="gap-2">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <Link href={`${storeUrl}/product/${product.slug}`} key={product.id}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow group border border-border bg-white">
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={product.images[0] || "/placeholder-product.png"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2 truncate">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">4.9</span>
                        </div>
                        <p className="text-lg font-bold text-primary">{product.price} ر.س</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-bold mb-2">لا توجد منتجات حالياً</h3>
              <p className="text-muted-foreground">كن أول من يتسوق عند توفر المنتجات</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="bg-primary rounded-3xl p-12 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-white/5 border-none text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="font-bold mb-2">شحن مجاني</h3>
              <p className="text-sm opacity-70">
                للطلبات فوق 200 ريال
              </p>
            </Card>

            <Card className="p-8 text-center bg-white/5 border-none text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold mb-2">ضمان الجودة</h3>
              <p className="text-sm opacity-70">
                منتجات أصلية 100%
              </p>
            </Card>

            <Card className="p-8 text-center bg-white/5 border-none text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="font-bold mb-2">إرجاع مجاني</h3>
              <p className="text-sm opacity-70">
                خلال 30 يوم من الشراء
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">اشترك في نشرتنا البريدية</h2>
          <p className="text-lg mb-8 opacity-80">
            احصل على آخر العروض والمنتجات الجديدة
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-6 py-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-border"
            />
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors">
              اشترك الآن
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
