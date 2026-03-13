import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, BarChart3, Palette, Zap, ShoppingCart, CreditCard, Truck, Globe, Check, ChevronLeft } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-accent font-bold text-lg">ت</span>
              </div>
              <span className="text-xl font-bold">ترميز</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm hover:text-accent transition-colors">المميزات</a>
              <a href="#pricing" className="text-sm hover:text-accent transition-colors">الأسعار</a>
              <a href="#templates" className="text-sm hover:text-accent transition-colors">القوالب</a>
              <a href="#ai" className="text-sm hover:text-accent transition-colors">أدوات AI</a>
              <a href="#resources" className="text-sm hover:text-accent transition-colors">الموارد</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">تسجيل الدخول</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-accent text-black hover:bg-accent/90">ابدأ مجاناً</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>منصة التجارة الإلكترونية المدعومة بالذكاء الاصطناعي</span>
          </div>
          <h1 className="text-6xl font-bold leading-tight">
            أنشئ متجرك الإلكتروني<br />
            في <span className="text-accent">دقائق</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            منصة شاملة لإنشاء وإدارة المتاجر الإلكترونية مع تحليلات متقدمة وتوصيات ذكية لزيادة مبيعاتك
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link href="/signup">
              <Button size="lg" className="bg-accent text-black hover:bg-accent/90 text-lg px-8 py-6">
                ابدأ متجرك الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              شاهد العرض التوضيحي
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span>بدون بطاقة ائتمان</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span>تجربة مجانية 14 يوم</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span>إلغاء في أي وقت</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-secondary rounded-2xl shadow-2xl p-4 border border-border">
            <div className="bg-white rounded-lg p-8 border border-border">
              <div className="text-right mb-6">
                <h3 className="text-sm text-muted-foreground mb-2">لوحة التحكم</h3>
                <h2 className="text-2xl font-bold">نظرة عامة على متجرك</h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "الإيرادات", value: "45,231 ر.س", change: "+12.5%" },
                  { label: "الطلبات", value: "1,234", change: "+8.2%" },
                  { label: "الزوار", value: "12,456", change: "+23.1%" },
                  { label: "معدل التحويل", value: "3.2%", change: "+0.5%" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border rounded-xl p-6 shadow-sm">
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-accent">{stat.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">كل ما تحتاجه لنجاح متجرك</h2>
            <p className="text-xl text-muted-foreground">أدوات قوية ومتكاملة لإدارة تجارتك الإلكترونية</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "ذكاء اصطناعي متقدم",
                description: "توصيات ذكية لتحسين المبيعات وتجربة العملاء بناءً على سلوك الزوار"
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "تحليلات شاملة",
                description: "تتبع دقيق للمبيعات والزوار ومعدلات التحويل مع رؤى قابلة للتنفيذ"
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "منشئ صفحات بالسحب والإفلات",
                description: "صمم صفحات منتجات احترافية بدون أي خبرة تقنية"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "سريع وآمن",
                description: "استضافة عالية الأداء مع حماية SSL وأمان متقدم"
              },
              {
                icon: <ShoppingCart className="w-6 h-6" />,
                title: "إدارة متكاملة",
                description: "إدارة المنتجات والطلبات والعملاء من لوحة تحكم واحدة"
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "دعم متعدد اللغات",
                description: "واجهة مصممة خصيصاً للغة العربية مع دعم RTL كامل"
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>مدعوم بالذكاء الاصطناعي</span>
              </div>
              <h2 className="text-4xl font-bold">توليد صفحات هبوط احترافية تلقائياً</h2>
              <p className="text-xl text-muted-foreground">
                اترك الذكاء الاصطناعي يصمم صفحات منتجات عالية التحويل بناءً على أفضل الممارسات والبيانات التحليلية
              </p>
              <ul className="space-y-4">
                {[
                  "تصميم تلقائي بناءً على نوع المنتج",
                  "نصوص تسويقية مقنعة",
                  "تحسين لمحركات البحث (SEO)",
                  "اختبار A/B تلقائي"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-accent text-black hover:bg-accent/90">
                جرّب الآن مجاناً
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>
            <div className="bg-secondary rounded-2xl p-8 border border-border">
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="font-bold">منشئ الصفحات بالذكاء الاصطناعي</span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">وصف المنتج</div>
                    <div className="h-2 bg-accent rounded w-3/4"></div>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">الصور المقترحة</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-accent/20 rounded"></div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">عناصر التحويل</div>
                    <div className="space-y-2">
                      <div className="h-2 bg-accent rounded w-full"></div>
                      <div className="h-2 bg-accent rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">تكامل مع أدواتك المفضلة</h2>
          <p className="text-xl text-muted-foreground mb-12">اتصل بسهولة مع منصات الدفع والشحن والتسويق</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "بوابات الدفع", items: ["مدى", "فيزا", "ماستركارد", "Apple Pay"] },
              { title: "شركات الشحن", items: ["أرامكس", "سمسا", "DHL", "فيديكس"] },
              { title: "أدوات التسويق", items: ["Google Analytics", "Facebook Pixel", "Mailchimp", "WhatsApp"] },
            ].map((category, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {i === 0 && <CreditCard className="w-6 h-6" />}
                  {i === 1 && <Truck className="w-6 h-6" />}
                  {i === 2 && <Globe className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {category.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">خطط تناسب جميع الأحجام</h2>
            <p className="text-xl text-muted-foreground">ابدأ مجاناً ثم قم بالترقية عند الحاجة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "المبتدئ",
                price: "مجاناً",
                period: "للأبد",
                features: [
                  "حتى 50 منتج",
                  "تحليلات أساسية",
                  "قالب واحد",
                  "دعم عبر البريد",
                ]
              },
              {
                name: "النمو",
                price: "199 ر.س",
                period: "شهرياً",
                features: [
                  "منتجات غير محدودة",
                  "تحليلات متقدمة",
                  "جميع القوالب",
                  "أدوات AI",
                  "دعم أولوية",
                ],
                popular: true
              },
              {
                name: "الاحترافي",
                price: "499 ر.س",
                period: "شهرياً",
                features: [
                  "كل مميزات النمو",
                  "فريق متعدد الأعضاء",
                  "API مخصص",
                  "مدير حساب مخصص",
                  "دعم 24/7",
                ]
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 border ${
                  plan.popular
                    ? "border-accent shadow-xl scale-105 bg-white"
                    : "border-border bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="bg-accent text-black text-sm font-bold px-4 py-1 rounded-full inline-block mb-4">
                    الأكثر شعبية
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground mr-2">/ {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-accent text-black hover:bg-accent/90"
                      : "bg-black text-white hover:bg-black/90"
                  }`}
                  size="lg"
                >
                  ابدأ الآن
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">
            جاهز لبدء متجرك الإلكتروني؟
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            انضم إلى آلاف التجار الذين يستخدمون ترميز لتنمية أعمالهم
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-accent text-black hover:bg-accent/90 text-lg px-8 py-6">
              ابدأ مجاناً الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-accent font-bold text-lg">ت</span>
                </div>
                <span className="text-xl font-bold">ترميز</span>
              </div>
              <p className="text-muted-foreground text-sm">
                منصة التجارة الإلكترونية الأولى عربياً
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">المنتج</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features">المميزات</a></li>
                <li><a href="#pricing">الأسعار</a></li>
                <li><a href="#templates">القوالب</a></li>
                <li><a href="#ai">أدوات AI</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الشركة</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">من نحن</a></li>
                <li><a href="#">المدونة</a></li>
                <li><a href="#">الوظائف</a></li>
                <li><a href="#">اتصل بنا</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الدعم</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">مركز المساعدة</a></li>
                <li><a href="#">الأسئلة الشائعة</a></li>
                <li><a href="#">الشروط والأحكام</a></li>
                <li><a href="#">سياسة الخصوصية</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 ترميز. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
