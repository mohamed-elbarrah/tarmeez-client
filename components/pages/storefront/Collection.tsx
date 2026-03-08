import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, SlidersHorizontal } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function Collection() {
  const { slug } = useParams();
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(true);

  const products = [
    {
      id: 1,
      name: "ساعة كلاسيكية فاخرة",
      price: "1,299",
      image: "https://images.unsplash.com/photo-1760532467646-b9e466403862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwd2F0Y2glMjBsdXh1cnl8ZW58MXx8fHwxNzcyODYwMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.8,
      slug: "luxury-watch",
      category: "إكسسوارات",
    },
    {
      id: 2,
      name: "حذاء رياضي عصري",
      price: "599",
      image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyODYwMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.9,
      slug: "sport-sneakers",
      category: "أحذية",
    },
    {
      id: 3,
      name: "نظارة شمسية مصمّمة",
      price: "899",
      image: "https://images.unsplash.com/photo-1759933253608-ba60cfb8dcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXMlMjBsdXh1cnl8ZW58MXx8fHwxNzcyNzg0NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.7,
      slug: "designer-sunglasses",
      category: "إكسسوارات",
    },
    {
      id: 4,
      name: "حقيبة ظهر جلدية",
      price: "799",
      image: "https://images.unsplash.com/photo-1594300418249-eebf1858e9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFja3BhY2slMjBicm93bnxlbnwxfHx8fDE3NzI4MjE2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.6,
      slug: "leather-backpack",
      category: "حقائب",
    },
    {
      id: 5,
      name: "سماعات لاسلكية",
      price: "1,199",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibGFja3xlbnwxfHx8fDE3NzI3ODM3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.9,
      slug: "wireless-headphones",
      category: "إلكترونيات",
    },
    {
      id: 6,
      name: "محفظة جلدية أنيقة",
      price: "449",
      image: "https://images.unsplash.com/photo-1676276550322-7623a2545b24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd2FsbGV0JTIwbGVhdGhlcnxlbnwxfHx8fDE3NzI4MzE1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.5,
      slug: "minimal-wallet",
      category: "إكسسوارات",
    },
    {
      id: 7,
      name: "هاتف ذكي حديث",
      price: "3,499",
      image: "https://images.unsplash.com/photo-1605188378873-3ddf764e6fff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9kZXJuJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI4MjM0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.8,
      slug: "modern-smartphone",
      category: "إلكترونيات",
    },
    {
      id: 8,
      name: "عطر فاخر",
      price: "1,599",
      image: "https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlJTIwbHV4dXJ5fGVufDF8fHx8MTc3Mjg2MDIyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.7,
      slug: "luxury-perfume",
      category: "عطور",
    },
  ];

  const collectionNames: Record<string, string> = {
    all: "جميع المنتجات",
    new: "المنتجات الجديدة",
    sale: "التخفيضات",
    bestsellers: "الأكثر مبيعاً",
    featured: "المنتجات المميزة",
    accessories: "الإكسسوارات",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {collectionNames[slug || "all"] || "مجموعة المنتجات"}
        </h1>
        <p className="text-muted-foreground">{products.length} منتج</p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`w-64 ${showFilters ? "block" : "hidden"} lg:block`}>
          <Card className="p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">التصفية</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-border">
              <h4 className="font-bold mb-4">السعر</h4>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={5000}
                step={100}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0]} ر.س</span>
                <span>{priceRange[1]} ر.س</span>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6 pb-6 border-b border-border">
              <h4 className="font-bold mb-4">الفئة</h4>
              <div className="space-y-3">
                {["إكسسوارات", "أحذية", "حقائب", "إلكترونيات", "عطور"].map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox id={category} />
                    <label htmlFor={category} className="text-sm cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-bold mb-4">التقييم</h4>
              <div className="space-y-3">
                {[5, 4, 3].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <Checkbox id={`rating-${rating}`} />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="text-sm cursor-pointer flex items-center gap-1"
                    >
                      <div className="flex">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-accent text-accent"
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">وأعلى</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and View Options */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              التصفية
            </Button>

            <Select defaultValue="featured">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">الأكثر شهرة</SelectItem>
                <SelectItem value="price-low">السعر: من الأقل</SelectItem>
                <SelectItem value="price-high">السعر: من الأعلى</SelectItem>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
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
                    <p className="text-xs text-muted-foreground mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-bold mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                      <p className="text-lg font-bold">{product.price} ر.س</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <Button variant="outline" disabled>
              السابق
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">التالي</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
