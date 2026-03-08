import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Edit } from "lucide-react";

export default function PlansManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">خطط الاشتراك</h1>
          <p className="text-muted-foreground">إدارة وتعديل الخطط</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { name: "المبتدئ", price: "مجاناً", subscribers: 892, features: ["حتى 50 منتج", "تحليلات أساسية", "قالب واحد", "دعم عبر البريد"] },
          { name: "النمو", price: "199 ر.س", subscribers: 456, popular: true, features: ["منتجات غير محدودة", "تحليلات متقدمة", "جميع القوالب", "أدوات AI", "دعم أولوية"] },
          { name: "الاحترافي", price: "499 ر.س", subscribers: 234, features: ["كل مميزات النمو", "فريق متعدد", "API مخصص", "مدير مخصص", "دعم 24/7"] },
        ].map((plan, i) => (
          <Card key={i} className={`p-6 ${plan.popular ? "border-accent border-2" : ""}`}>
            {plan.popular && (
              <div className="bg-accent text-black px-3 py-1 rounded-full text-xs font-bold inline-block mb-4">
                الأكثر شعبية
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="text-3xl font-bold mb-1">{plan.price}</div>
            <div className="text-sm text-muted-foreground mb-6">{plan.subscribers} مشترك</div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
