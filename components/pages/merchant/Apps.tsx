import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";

export default function Apps() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">التطبيقات</h1>
        <p className="text-muted-foreground">وسّع إمكانيات متجرك</p>
      </div>

      <div className="flex gap-2">
        {["الكل", "المثبتة", "التسويق", "المبيعات", "الشحن"].map((tab, i) => (
          <Button key={i} variant={i === 0 ? "default" : "outline"}
            className={i === 0 ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}>
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { name: "WhatsApp Business", category: "تواصل", rating: 4.8, installs: "2.3k", price: "مجاني" },
          { name: "Google Analytics", category: "تحليلات", rating: 4.9, installs: "5.1k", price: "مجاني" },
          { name: "Facebook Pixel", category: "تسويق", rating: 4.7, installs: "3.2k", price: "مجاني" },
          { name: "SMS Marketing", category: "تسويق", rating: 4.6, installs: "1.8k", price: "99 ر.س/شهر" },
          { name: "Product Reviews", category: "مبيعات", rating: 4.9, installs: "4.5k", price: "مجاني" },
          { name: "Live Chat", category: "دعم", rating: 4.8, installs: "2.7k", price: "149 ر.س/شهر" },
        ].map((app, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-2 mb-4">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">{app.name}</h3>
                <p className="text-sm text-muted-foreground">{app.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-medium">{app.rating}</span>
              </div>
              <span className="text-muted-foreground">{app.installs} تثبيت</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{app.price}</span>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                تثبيت
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
