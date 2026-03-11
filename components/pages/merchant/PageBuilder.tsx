import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Sparkles, Type, Image as ImageIcon, Layout, Grid3x3 } from "lucide-react";

const SECTION_TYPES = [
  { id: "hero", name: "Hero Section", icon: Layout },
  { id: "text", name: "نص", icon: Type },
  { id: "image", name: "صورة", icon: ImageIcon },
  { id: "grid", name: "شبكة منتجات", icon: Grid3x3 },
];

function DraggableSection({ type }: { type: typeof SECTION_TYPES[0] }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "section",
    item: { type: type.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

    return (
    <div
      ref={drag as any}
      className={`p-4 bg-white border-2 border-dashed border-border rounded-lg cursor-move hover:border-accent transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <type.icon className="w-5 h-5" />
        <span className="text-sm font-medium">{type.name}</span>
      </div>
    </div>
  );
}

function Canvas() {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "section",
    drop: () => ({ name: "Canvas" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

    return (
    <div
      ref={drop as any}
      className={`min-h-[600px] bg-white border-2 border-dashed rounded-lg p-8 ${
        isOver ? "border-accent bg-accent/5" : "border-border"
      }`}
    >
      <div className="text-center text-muted-foreground">
        <Layout className="w-12 h-12 mx-auto mb-4" />
        <p>اسحب العناصر هنا لبناء صفحتك</p>
      </div>
    </div>
  );
}

export default function PageBuilder() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">منشئ الصفحات</h1>
            <p className="text-muted-foreground">صمم صفحات احترافية بالسحب والإفلات</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Sparkles className="w-4 h-4 ml-2" />
              إنشاء بالذكاء الاصطناعي
            </Button>
            <Button className="bg-accent text-black hover:bg-accent/90">نشر الصفحة</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-bold mb-4">العناصر</h3>
              <div className="space-y-2">
                {SECTION_TYPES.map((type) => (
                  <DraggableSection key={type.id} type={type} />
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold mb-4">القوالب</h3>
              <div className="space-y-2">
                {["صفحة منتج", "صفحة هبوط", "صفحة مجموعة"].map((template, i) => (
                  <button
                    key={i}
                    className="w-full p-3 bg-secondary rounded-lg text-sm hover:bg-accent/10 transition-colors text-right"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Canvas */}
          <div className="col-span-3">
            <Card className="p-6">
              <Canvas />
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
