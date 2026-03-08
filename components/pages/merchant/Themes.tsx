import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

export default function Themes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">القوالب</h1>
        <p className="text-muted-foreground">اختر قالب احترافي لمتجرك</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {["الكل", "أزياء", "إلكترونيات", "طعام", "رياضة"].map((cat, i) => (
          <Button
            key={i}
            variant={i === 0 ? "default" : "outline"}
            className={i === 0 ? "bg-accent text-black hover:bg-accent/90" : ""}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { name: "Modern Shop", price: "مجاني", popular: true },
          { name: "Minimal Store", price: "مجاني", popular: false },
          { name: "Fashion Pro", price: "299 ر.س", popular: true },
          { name: "Tech Store", price: "199 ر.س", popular: false },
          { name: "Food Market", price: "مجاني", popular: false },
          { name: "Sports Elite", price: "399 ر.س", popular: true },
        ].map((theme, i) => (
          <Card key={i} className="overflow-hidden">
            {theme.popular && (
              <div className="bg-accent text-black px-4 py-1 text-xs font-bold text-center">
                الأكثر شعبية
              </div>
            )}
            <div className="aspect-[4/3] bg-secondary border-b border-border"></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{theme.name}</h3>
                <span className="text-sm font-medium">{theme.price}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 ml-1" />
                  معاينة
                </Button>
                <Button size="sm" className="flex-1 bg-accent text-black hover:bg-accent/90">
                  <Download className="w-4 h-4 ml-1" />
                  تثبيت
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
