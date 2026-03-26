"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInviteMemberMutation } from "@/lib/services/teamApi";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "مدير", description: "صلاحيات كاملة عدا الفوترة" },
  { value: "EDITOR", label: "محرر", description: "إدارة المنتجات والصفحات" },
  {
    value: "MARKETER",
    label: "مسوّق",
    description: "إدارة الكوبونات والتسويق",
  },
] as const;

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة"),
  role: z
    .enum(["ADMIN", "EDITOR", "MARKETER"] as const)
    .refine((v) => v !== undefined, { message: "يرجى اختيار دور" }),
});

type FormValues = z.infer<typeof schema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InviteMemberModal({ open, onClose }: InviteMemberModalProps) {
  const [inviteMember, { isLoading }] = useInviteMemberMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: "EDITOR" },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await inviteMember(values).unwrap();
      toast.success("تم إرسال الدعوة بنجاح", {
        description: `تم إرسال دعوة إلى ${values.email}`,
      });
      handleClose();
    } catch (err: any) {
      const message =
        err?.data?.message ===
        "An active invitation already exists for this email"
          ? "يوجد دعوة نشطة مسبقاً لهذا البريد"
          : (err?.data?.message ?? "حدث خطأ، يرجى المحاولة مجدداً");
      toast.error("فشل إرسال الدعوة", { description: message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="sm:max-w-md"
        dir="rtl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <UserPlus className="w-5 h-5 text-primary" />
            دعوة عضو جديد
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pt-1"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@domain.com"
                      dir="ltr"
                      className="text-left placeholder:text-right"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدور الوظيفي</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر دوراً" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent dir="rtl">
                      {ROLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex flex-col gap-0.5 py-0.5">
                            <span className="font-medium">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {opt.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 ml-2" />
                    إرسال الدعوة
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
