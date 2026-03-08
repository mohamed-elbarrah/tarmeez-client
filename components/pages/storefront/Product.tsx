import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function Product() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    name: "ساعة كلاسيكية فاخرة",
    price: "1,299",
    oldPrice: "1,599",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    sku: "WTH-2024-001",
    description: "ساعة كلاسيكية فاخرة مصممة بعناية فائقة لتجمع بين الأناقة الخالدة والحرفية العالية. تتميز بحركة سويسرية دقيقة وتصميم عصري يناسب جميع المناسبات.",
    features: [
      "حركة سويسرية أوتوماتيكية",
      "مقاومة للماء حتى 100 متر",
      "زجاج ياقوتي مضاد للخدش",
      "حزام جلد طبيعي",
      "ضمان لمدة سنتين",
    ],
    images: [
      "https://images.unsplash.com/photo-1760532467646-b9e466403862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwd2F0Y2glMjBsdXh1cnl8ZW58MXx8fHwxNzcyODYwMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyODYwMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1759933253608-ba60cfb8dcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXMlMjBsdXh1cnl8ZW58MXx8fHwxNzcyNzg0NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "black", label: "أسود", hex: "#000000" },
      { name: "brown", label: "بني", hex: "#8B4513" },
      { name: "navy", label: "كحلي", hex: "#000080" },
    ],
  };

  const relatedProducts = [
    {
      id: 2,
      name: "حذاء رياضي عصري",
      price: "599",
      image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyODYwMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      slug: "sport-sneakers",
    },
    {
      id: 3,
      name: "نظارة شمسية مصمّمة",
      price: "899",
      image: "https://images.unsplash.com/photo-1759933253608-ba60cfb8dcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXMlMjBsdXh1cnl8ZW58MXx8fHwxNzcyNzg0NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      slug: "designer-sunglasses",
    },
    {
      id: 4,
      name: "حقيبة ظهر جلدية",
      price: "799",
      image: "https://images.unsplash.com/photo-1594300418249-eebf1858e9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFja3BhY2slMjBicm93bnxlbnwxfHx8fDE3NzI4MjE2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      slug: "leather-backpack",
    },
  ];

  const reviews = [
    {
      id: 1,
      author: "أحمد محمد",
      rating: 5,
      date: "2026-03-01",
      comment: "منتج رائع وجودة عالية جداً. أنصح به بشدة!",
    },
    {
      id: 2,
      author: "سارة علي",
      rating: 5,
      date: "2026-02-28",
      comment: "تصميم جميل وأنيق. الشحن كان سريع والتغليف ممتاز.",
    },
    {
      id: 3,
      author: "محمد عبدالله",
      rating: 4,
      date: "2026-02-25",
      comment: "جودة ممتازة ولكن السعر مرتفع قليلاً.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" dir="rtl">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-muted-foreground">
        <Link href="/store" className="hover:text-foreground">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <Link href="/store/collection/all" className="hover:text-foreground">
          المنتجات
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <Card className="overflow-hidden mb-4">
            <div className="relative h-[500px]">
              <ImageWithFallback
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <Card
                key={index}
                className={`overflow-hidden cursor-pointer border-2 ${
                  selectedImage === index ? "border-accent" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="relative h-32">
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews} تقييم)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-baseline gap-4 mb-6">
            <p className="text-4xl font-bold">{product.price} ر.س</p>
            {product.oldPrice && (
              <p className="text-xl text-muted-foreground line-through">
                {product.oldPrice} ر.س
              </p>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            {product.inStock ? (
              <>
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="text-accent font-medium">متوفر في المخزون</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-destructive rounded-full" />
                <span className="text-destructive font-medium">غير متوفر</span>
              </>
            )}
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">المقاس</h3>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                  className="w-16"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">اللون</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-12 h-12 rounded-full border-2 ${
                    selectedColor === color.name
                      ? "border-accent"
                      : "border-gray-300"
                  } relative`}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                >
                  {selectedColor === color.name && (
                    <Check className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">الكمية</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4 mb-6">
            <Button size="lg" className="flex-1 gap-2">
              <ShoppingCart className="w-5 h-5" />
              أضف إلى السلة
            </Button>
            <Button size="lg" variant="outline">
              اشترِ الآن
            </Button>
          </div>

          {/* Features */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">المميزات</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Product Info Tabs */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">الوصف</TabsTrigger>
          <TabsTrigger value="specs">المواصفات</TabsTrigger>
          <TabsTrigger value="reviews">التقييمات ({reviews.length})</TabsTrigger>
          <TabsTrigger value="shipping">الشحن والإرجاع</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="p-6">
            <p className="text-lg leading-relaxed">{product.description}</p>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="font-medium">رقم المنتج</span>
                <span className="text-muted-foreground">{product.sku}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="font-medium">الوزن</span>
                <span className="text-muted-foreground">150 جرام</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="font-medium">الأبعاد</span>
                <span className="text-muted-foreground">42 × 12 × 8 مم</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="font-medium">المادة</span>
                <span className="text-muted-foreground">ستانلس ستيل</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold mb-1">{review.author}</h4>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-accent text-accent"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.date}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">الشحن والتوصيل</h3>
            <ul className="space-y-2 mb-6">
              <li>• شحن مجاني للطلبات فوق 200 ريال</li>
              <li>• التوصيل خلال 3-5 أيام عمل</li>
              <li>• إمكانية الدفع عند الاستلام</li>
            </ul>
            <h3 className="font-bold mb-4">سياسة الإرجاع</h3>
            <ul className="space-y-2">
              <li>• إرجاع مجاني خلال 30 يوم</li>
              <li>• يجب أن يكون المنتج في حالته الأصلية</li>
              <li>• استرجاع كامل المبلغ</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <section>
        <h2 className="text-3xl font-bold mb-8">منتجات ذات صلة</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
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
                  <p className="text-lg font-bold">{product.price} ر.س</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
