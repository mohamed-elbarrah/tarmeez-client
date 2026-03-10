import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Search } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function Blog() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;
  const storeUrl = `/store/${storeSlug}`;

  const posts = [
    {
      id: 1,
      title: "دليل اختيار الساعة المثالية لمناسباتك",
      excerpt: "تعرف على كيفية اختيار الساعة المناسبة لكل مناسبة، من الاجتماعات الرسمية إلى المناسبات الاجتماعية.",
      image: "https://images.unsplash.com/photo-1760532467646-b9e466403862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwd2F0Y2glMjBsdXh1cnl8ZW58MXx8fHwxNzcyODYwMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "أسلوب الحياة",
      date: "2026-03-05",
      readTime: "5 دقائق",
      author: "سارة أحمد",
      slug: "how-to-choose-perfect-watch",
    },
    {
      id: 2,
      title: "أحدث صيحات الموضة في عالم الأحذية الرياضية",
      excerpt: "استكشف أحدث التصاميم والألوان في عالم الأحذية الرياضية لهذا الموسم.",
      image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyODYwMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "موضة",
      date: "2026-03-03",
      readTime: "4 دقائق",
      author: "محمد علي",
      slug: "latest-sneakers-trends",
    },
    {
      id: 3,
      title: "كيف تعتني بنظاراتك الشمسية المصممة",
      excerpt: "نصائح مهمة للحفاظ على نظاراتك الشمسية في حالة ممتازة لسنوات قادمة.",
      image: "https://images.unsplash.com/photo-1759933253608-ba60cfb8dcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXMlMjBsdXh1cnl8ZW58MXx8fHwxNzcyNzg0NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "نصائح",
      date: "2026-03-01",
      readTime: "3 دقائق",
      author: "نورة خالد",
      slug: "sunglasses-care-tips",
    },
    {
      id: 4,
      title: "اختيار الحقيبة المثالية للسفر",
      excerpt: "دليلك الشامل لاختيار حقيبة السفر المناسبة لاحتياجاتك وأسلوبك.",
      image: "https://images.unsplash.com/photo-1594300418249-eebf1858e9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFja3BhY2slMjBicm93bnxlbnwxfHx8fDE3NzI4MjE2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "سفر",
      date: "2026-02-28",
      readTime: "6 دقائق",
      author: "عبدالله محمود",
      slug: "perfect-travel-bag",
    },
    {
      id: 5,
      title: "أفضل سماعات لاسلكية لعام 2026",
      excerpt: "مراجعة شاملة لأفضل السماعات اللاسلكية المتاحة في السوق هذا العام.",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibGFja3xlbnwxfHx8fDE3NzI3ODM3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "تقنية",
      date: "2026-02-25",
      readTime: "7 دقائق",
      author: "فهد عبدالعزيز",
      slug: "best-wireless-headphones-2026",
    },
    {
      id: 6,
      title: "العطور: فن اختيار الرائحة المناسبة",
      excerpt: "كيف تختار العطر المثالي الذي يناسب شخصيتك والمناسبة.",
      image: "https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlJTIwbHV4dXJ5fGVufDF8fHx8MTc3Mjg2MDIyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "أسلوب الحياة",
      date: "2026-02-22",
      readTime: "5 دقائق",
      author: "ليلى حسن",
      slug: "perfume-selection-guide",
    },
  ];

  const categories = [
    "الكل",
    "أسلوب الحياة",
    "موضة",
    "نصائح",
    "سفر",
    "تقنية",
  ];

  const featuredPost = posts[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" dir="rtl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">المدونة</h1>
        <p className="text-xl text-muted-foreground">
          آخر الأخبار والنصائح في عالم الموضة والأسلوب
        </p>
      </div>

      {/* Search and Categories */}
      <div className="mb-12">
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث في المقالات..."
              className="pr-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "الكل" ? "default" : "outline"}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <Card className="overflow-hidden mb-12">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-96 md:h-auto">
            <ImageWithFallback
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <Badge className="w-fit mb-4 bg-accent text-black">
              مقال مميز
            </Badge>
            <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
            <p className="text-muted-foreground mb-6">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{featuredPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
            <Link href={`${storeUrl}/blog/${featuredPost.slug}`}>
              <Button className="gap-2">
                اقرأ المزيد
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {posts.slice(1).map((post) => (
          <Link href={`${storeUrl}/blog/${post.slug}`} key={post.id}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow group h-full">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <Badge variant="secondary" className="mb-3">
                  {post.category}
                </Badge>
                <h3 className="font-bold text-lg mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          تحميل المزيد من المقالات
        </Button>
      </div>

      {/* Newsletter */}
      <Card className="mt-16 p-8 md:p-12 bg-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            اشترك في نشرتنا البريدية
          </h2>
          <p className="text-muted-foreground mb-8">
            احصل على آخر المقالات والنصائح مباشرة في بريدك الإلكتروني
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1"
            />
            <Button>اشترك</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
