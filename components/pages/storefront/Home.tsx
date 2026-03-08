import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function StorefrontHome() {
  const featuredProducts = [
    {
      id: 1,
      name: "ساعة كلاسيكية فاخرة",
      price: "1,299",
      image: "https://images.unsplash.com/photo-1760532467646-b9e466403862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwd2F0Y2glMjBsdXh1cnl8ZW58MXx8fHwxNzcyODYwMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.8,
      slug: "luxury-watch",
    },
    {
      id: 2,
      name: "حذاء رياضي عصري",
      price: "599",
      image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyODYwMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.9,
      slug: "sport-sneakers",
    },
    {
      id: 3,
      name: "نظارة شمسية مصمّمة",
      price: "899",
      image: "https://images.unsplash.com/photo-1759933253608-ba60cfb8dcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXMlMjBsdXh1cnl8ZW58MXx8fHwxNzcyNzg0NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.7,
      slug: "designer-sunglasses",
    },
    {
      id: 4,
      name: "حقيبة ظهر جلدية",
      price: "799",
      image: "https://images.unsplash.com/photo-1594300418249-eebf1858e9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFja3BhY2slMjBicm93bnxlbnwxfHx8fDE3NzI4MjE2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.6,
      slug: "leather-backpack",
    },
  ];

  const collections = [
    { name: "الجديد", slug: "new", count: 45 },
    { name: "الأكثر مبيعاً", slug: "bestsellers", count: 32 },
    { name: "التخفيضات", slug: "sale", count: 28 },
    { name: "الإكسسوارات", slug: "accessories", count: 67 },
  ];

  return (
    <div dir="rtl">
      {/* Hero Section */}
      <section className="bg-secondary py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                اكتشف مجموعتنا الجديدة
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                تشكيلة حصرية من المنتجات العصرية المصممة خصيصاً لك
              </p>
              <div className="flex gap-4">
                <Link href="/store/collection/new">
                  <Button size="lg" className="gap-2">
                    تسوق الآن
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/store/collection/all">
                  <Button size="lg" variant="outline">
                    جميع المنتجات
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibGFja3xlbnwxfHx8fDE3NzI3ODM3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="منتجات مميزة"
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
              <Link href={`/store/collection/${collection.slug}`} key={collection.slug}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
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
            <Link href="/store/collection/featured">
              <Button variant="ghost" className="gap-2">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link href={`/store/product/${product.slug}`} key={product.id}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-brand text-brand" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                      <p className="text-lg font-bold">{product.price} ر.س</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="bg-primary rounded-3xl p-12 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent"
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
              <p className="text-sm text-muted-foreground">
                للطلبات فوق 200 ريال
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent"
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
              <p className="text-sm text-muted-foreground">
                منتجات أصلية 100%
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent"
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
              <p className="text-sm text-muted-foreground">
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
              className="flex-1 px-6 py-4 rounded-xl bg-primary-foreground text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 transition-all border-none"
            />
            <button className="px-8 py-4 bg-background text-foreground rounded-xl font-bold hover:bg-muted transition-colors">
              اشترك الآن
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
