import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";

export default function AppsMarketplace() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">سوق التطبيقات</h1>
          <p className="text-muted-foreground">إدارة التطبيقات المتاحة</p>
        </div>
        <Button className="bg-accent text-black hover:bg-accent/90">
          <Plus className="w-4 h-4 ml-2" />
          إضافة تطبيق
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-2 mb-4">
              <div className="w-16 h-16 bg-accent/10 rounded-xl"></div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">App {i + 1}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span>4.{8 - i}</span>
                  <span className="text-muted-foreground">• {Math.floor(Math.random() * 5000)} تثبيت</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">تعديل</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
