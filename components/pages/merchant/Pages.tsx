"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Archive,
  RefreshCcw,
  Layout,
} from "lucide-react";
import {
  useGetPagesQuery,
  useDeletePageMutation,
  useUpdatePageStatusMutation,
} from "@/lib/services/pagesApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CreatePageModal from "./pages/CreatePageModal";

const statusMap: Record<
  string,
  {
    label: string;
    variant: "outline" | "default" | "secondary" | "destructive";
  }
> = {
  DRAFT: { label: "مسودة", variant: "secondary" },
  PUBLISHED: { label: "منشورة", variant: "default" },
  ARCHIVED: { label: "مؤرشفة", variant: "outline" },
};

const typeMap: Record<string, { label: string; color: string }> = {
  LANDING: { label: "هبوط", color: "bg-primary/10 text-primary" },
  CUSTOM: { label: "مخصصة", color: "bg-secondary text-secondary-foreground" },
  POLICY: { label: "سياسة", color: "bg-muted text-muted-foreground" },
};

export default function PagesDashboard() {
  const { data: pages, isLoading } = useGetPagesQuery();
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();
  const [updateStatus] = useUpdatePageStatusMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPages =
    pages?.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()),
    ) ?? [];

  const stats = {
    total: pages?.length ?? 0,
    published: pages?.filter((p) => p.status === "PUBLISHED").length ?? 0,
    drafts: pages?.filter((p) => p.status === "DRAFT").length ?? 0,
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePage(id).unwrap();
      toast.success("تم حذف الصفحة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الصفحة");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "ARCHIVED" ? "DRAFT" : "ARCHIVED";
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast.success(
        nextStatus === "DRAFT" ? "تم استعادة الصفحة" : "تم أرشفة الصفحة",
      );
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير حالة الصفحة");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">صفحاتي</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة محتوى متجرك وصفحات الهبوط
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="sm"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          إنشاء صفحة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "إجمالي الصفحات", value: stats.total, icon: Layout },
          { label: "منشورة", value: stats.published, icon: Eye },
          { label: "مسودات", value: stats.drafts, icon: Edit },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
              <stat.icon className="w-8 h-8 text-muted-foreground/20" />
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="بحث عن صفحة..."
            className="pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Pages Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                  العنوان
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                  النوع
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                  الحالة
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                  تاريخ الإنشاء
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border animate-pulse">
                    <td colSpan={5} className="py-8 px-6">
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Layout className="w-12 h-12 text-muted-foreground/20 mb-2" />
                      <p className="text-muted-foreground font-medium">
                        لا توجد صفحات بعد
                      </p>
                      <Button
                        variant="link"
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        إنشاء أول صفحة
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium">
                      <div className="flex flex-col">
                        <span>{page.title}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          /{page.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${typeMap[page.type]?.color}`}
                      >
                        {typeMap[page.type]?.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={statusMap[page.status]?.variant}>
                        {statusMap[page.status]?.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {new Date(page.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link href={`/merchant/pages/${page.id}/edit`}>
                          <Button variant="ghost" size="sm" title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/store/${page.storeId}/p/${page.slug}`}
                          target="_blank"
                        >
                          <Button variant="ghost" size="sm" title="معاينة">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          title={
                            page.status === "ARCHIVED" ? "استعادة" : "أرشفة"
                          }
                          onClick={() =>
                            handleStatusToggle(page.id, page.status)
                          }
                        >
                          {page.status === "ARCHIVED" ? (
                            <RefreshCcw className="w-4 h-4" />
                          ) : (
                            <Archive className="w-4 h-4" />
                          )}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>حذف الصفحة؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                سيتم حذف الصفحة وإزالتها من المتجر نهائياً. لا
                                يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(page.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CreatePageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
