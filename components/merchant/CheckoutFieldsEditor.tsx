"use client";

import React, { useState, useRef } from "react";
import {
  GripVertical, Pencil, Trash2, Plus, Lock,
  Type, Phone, Mail, MapPin, AlignLeft,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CheckoutFieldConfig, CheckoutFieldType } from "@/lib/types/auth";

// ─── Constants ────────────────────────────────────────────────────────────────

const CORE_FIELD_IDS = new Set(["name", "phone", "email", "address"]);

type FieldTypeMeta = { label: string; Icon: React.ElementType; color: string };

const FIELD_TYPE_META: Record<string, FieldTypeMeta> = {
  text:     { label: "نص",        Icon: Type,      color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  phone:    { label: "هاتف",      Icon: Phone,     color: "bg-green-500/10 text-green-600 border-green-500/20" },
  email:    { label: "بريد",      Icon: Mail,      color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  address:  { label: "عنوان",     Icon: MapPin,    color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  textarea: { label: "نص طويل",   Icon: AlignLeft, color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
};

const defaultMeta: FieldTypeMeta = {
  label: "نص", Icon: Type, color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CheckoutFieldsEditorProps {
  value: CheckoutFieldConfig[];
  onChange: (fields: CheckoutFieldConfig[]) => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutFieldsEditor({ value, onChange, disabled }: CheckoutFieldsEditorProps) {
  const [editingField, setEditingField] = useState<CheckoutFieldConfig | null>(null);
  const [editForm, setEditForm] = useState({ label: "", placeholder: "" });

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<{ label: string; placeholder: string; type: CheckoutFieldType }>({
    label: "", placeholder: "", type: "text",
  });

  // Drag & drop state
  const dragIndex = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const fields = Array.isArray(value) ? [...value].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) : [];

  const commit = (updated: CheckoutFieldConfig[]) => {
    onChange(updated.map((f, i) => ({ ...f, sortOrder: i })));
  };

  // ── Toggles ──────────────────────────────────────────────────────────────
  const toggleEnabled = (id: string, val: boolean) => {
    commit(fields.map((f) => f.id === id ? { ...f, enabled: val, required: val ? f.required : false } : f));
  };
  const toggleRequired = (id: string, val: boolean) => {
    commit(fields.map((f) => f.id === id ? { ...f, required: val } : f));
  };

  // ── Edit dialog ───────────────────────────────────────────────────────────
  const openEdit = (field: CheckoutFieldConfig) => {
    setEditingField(field);
    setEditForm({ label: field.label, placeholder: field.placeholder ?? "" });
  };
  const saveEdit = () => {
    if (!editingField) return;
    commit(fields.map((f) => f.id === editingField.id
      ? { ...f, label: editForm.label.trim(), placeholder: editForm.placeholder }
      : f));
    setEditingField(null);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteField = (id: string) => commit(fields.filter((f) => f.id !== id));

  // ── Add custom ────────────────────────────────────────────────────────────
  const addField = () => {
    const id = `custom_${Date.now()}`;
    commit([...fields, {
      id, type: addForm.type, label: addForm.label.trim(),
      placeholder: addForm.placeholder, enabled: true, required: false,
      isCustom: true, sortOrder: fields.length,
    }]);
    setAddForm({ label: "", placeholder: "", type: "text" });
    setAddOpen(false);
  };

  // ── Drag & drop ───────────────────────────────────────────────────────────
  const onDragStart = (i: number) => { dragIndex.current = i; };
  const onDragOver  = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOverIdx(i); };
  const onDrop      = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === dropIdx) { setDragOverIdx(null); return; }
    const reordered = [...fields];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(dropIdx, 0, moved);
    commit(reordered);
    dragIndex.current = null;
    setDragOverIdx(null);
  };
  const onDragEnd = () => { dragIndex.current = null; setDragOverIdx(null); };

  return (
    <div className="space-y-2" dir="rtl">
      {/* ── Field list ── */}
      {fields.map((field, index) => {
        const meta = FIELD_TYPE_META[field.type] ?? defaultMeta;
        const { Icon } = meta;
        const isCore    = CORE_FIELD_IDS.has(field.id);
        const isDragging = dragOverIdx === index;

        return (
          <div
            key={field.id}
            draggable={!disabled}
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={onDragEnd}
            className={cn(
              "group flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-150 select-none",
              field.enabled
                ? "bg-background border-border hover:border-border/80"
                : "bg-muted/20 border-dashed border-border/40 opacity-60",
              isDragging && "border-primary bg-primary/5 shadow-md scale-[1.01]",
              !disabled && "cursor-grab active:cursor-grabbing",
            )}
          >
            {/* Drag handle */}
            <GripVertical className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              disabled ? "text-muted-foreground/20" : "text-muted-foreground/30 group-hover:text-muted-foreground/70",
            )} />

            {/* Type badge */}
            <span className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0", meta.color)}>
              <Icon className="w-3 h-3" />
              {meta.label}
            </span>

            {/* Label + placeholder preview */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight">{field.label}</p>
              {field.placeholder && (
                <p className="text-[10px] text-muted-foreground/60 truncate leading-tight">{field.placeholder}</p>
              )}
            </div>

            {/* Required • Optional badge */}
            <span className={cn(
              "hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
              field.required && field.enabled
                ? "bg-red-500/10 text-red-600 border-red-400/25"
                : "bg-muted text-muted-foreground border-border",
            )}>
              {field.required && field.enabled ? "إلزامي" : "اختياري"}
            </span>

            {/* Toggles */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-muted-foreground tracking-wide uppercase">ظاهر</span>
                <Switch
                  checked={field.enabled}
                  onCheckedChange={(v) => toggleEnabled(field.id, v)}
                  disabled={disabled}
                  className="scale-75 origin-center"
                />
              </div>
              <div className={cn("flex flex-col items-center gap-0.5", !field.enabled && "opacity-30 pointer-events-none")}>
                <span className="text-[9px] text-muted-foreground tracking-wide uppercase">إلزامي</span>
                <Switch
                  checked={field.required}
                  onCheckedChange={(v) => toggleRequired(field.id, v)}
                  disabled={disabled || !field.enabled}
                  className="scale-75 origin-center"
                />
              </div>
            </div>

            {/* Edit */}
            <Button type="button" variant="ghost" size="icon" className="shrink-0 w-7 h-7"
              onClick={() => openEdit(field)} disabled={disabled}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>

            {/* Delete / Lock */}
            {isCore ? (
              <Lock className="w-3.5 h-3.5 text-muted-foreground/25 shrink-0" />
            ) : (
              <Button type="button" variant="ghost" size="icon"
                className="shrink-0 w-7 h-7 text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteField(field.id)} disabled={disabled}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        );
      })}

      {/* ── Add custom field ── */}
      {!disabled && (
        <Button type="button" variant="outline"
          className="w-full border-dashed gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 mt-2"
          onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4" />
          إضافة حقل مخصص
        </Button>
      )}

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editingField} onOpenChange={(o) => !o && setEditingField(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل {editingField?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>الاسم الظاهر للعميل <span className="text-destructive">*</span></Label>
              <Input value={editForm.label}
                onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="مثال: الاسم الكامل" />
            </div>
            <div className="space-y-2">
              <Label>النص التوضيحي (Placeholder)</Label>
              <Input value={editForm.placeholder}
                onChange={(e) => setEditForm((f) => ({ ...f, placeholder: e.target.value }))}
                placeholder="مثال: أدخل اسمك هنا" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="button" onClick={saveEdit} disabled={!editForm.label.trim()}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Custom Field Dialog ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة حقل مخصص</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>نوع الحقل</Label>
              <Select value={addForm.type}
                onValueChange={(v) => setAddForm((f) => ({ ...f, type: v as CheckoutFieldType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">نص قصير</SelectItem>
                  <SelectItem value="textarea">نص طويل</SelectItem>
                  <SelectItem value="phone">رقم هاتف</SelectItem>
                  <SelectItem value="email">بريد إلكتروني</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الاسم الظاهر للعميل <span className="text-destructive">*</span></Label>
              <Input value={addForm.label}
                onChange={(e) => setAddForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="مثال: رقم الهوية الوطنية" />
            </div>
            <div className="space-y-2">
              <Label>النص التوضيحي (Placeholder)</Label>
              <Input value={addForm.placeholder}
                onChange={(e) => setAddForm((f) => ({ ...f, placeholder: e.target.value }))}
                placeholder="مثال: أدخل رقم هويتك" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="button" onClick={addField} disabled={!addForm.label.trim()}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
