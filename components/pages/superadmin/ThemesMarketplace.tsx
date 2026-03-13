import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function ThemesMarketplace() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">سوق القوالب</h1>
          <p className="text-muted-foreground">إدارة القوالب المتاحة</p>
        </div>
        <Button className="bg-accent text-black hover:bg-accent/90">
          <Plus className="w-4 h-4 ml-2" />
          إضافة قالب
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "إجمالي القوالب", value: "45" },
          { label: "مجانية", value: "28" },
          { label: "مدفوعة", value: "17" },
          { label: "التنزيلات", value: "12,456" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[4/3] bg-secondary border-b border-border"></div>
            <div className="p-4">
              <h3 className="font-bold mb-1">Theme {i + 1}</h3>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">{Math.floor(Math.random() * 1000)} تنزيل</span>
                <span className="font-medium">{i % 2 === 0 ? "مجاني" : "199 ر.س"}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">تعديل</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
