"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Users, UserCheck, UserX, DollarSign } from "lucide-react";
import { useState } from "react";
import {
  useGetCustomersQuery,
  useUpdateCustomerStatusMutation,
} from "@/lib/services/merchantApi";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetCustomersQuery({
    search,
    status,
    page,
    limit: 20,
  });
  const [updateStatus] = useUpdateCustomerStatusMutation();

  const handleBan = async (id: string) => {
    await updateStatus({ id, status: "BANNED" });
  };
  const handleUnban = async (id: string) => {
    await updateStatus({ id, status: "ACTIVE" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">العملاء</h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة قاعدة عملائك</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي العملاء", value: data?.total ?? 0, icon: Users },
          {
            label: "العملاء النشطون",
            value:
              data?.items?.filter((i: any) => i.status === "ACTIVE").length ??
              0,
            icon: UserCheck,
          },
          {
            label: "المحظورون",
            value:
              data?.items?.filter((i: any) => i.status === "BANNED").length ??
              0,
            icon: UserX,
          },
          { label: "إجمالي الإنفاق", value: 0, icon: DollarSign },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="بحث عن عميل..."
            className="pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={status === undefined ? "default" : "outline"}
            onClick={() => setStatus(undefined)}
          >
            الكل
          </Button>
          <Button
            size="sm"
            variant={status === "ACTIVE" ? "default" : "outline"}
            onClick={() => setStatus("ACTIVE")}
          >
            نشط
          </Button>
          <Button
            size="sm"
            variant={status === "BANNED" ? "default" : "outline"}
            onClick={() => setStatus("BANNED")}
          >
            محظور
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">
                  العميل
                </th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">
                  الموقع
                </th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">
                  الطلبات
                </th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">
                  إجمالي الإنفاق
                </th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {(data?.items ?? []).map((customer: any) => (
                <tr
                  key={customer.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-bold text-sm text-primary">
                          {(customer.fullName || "؟")[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {customer.fullName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">—</td>
                  <td className="py-3 px-2 text-sm">
                    {customer.ordersCount ?? 0}
                  </td>
                  <td className="py-3 px-2 text-sm font-medium">
                    {customer.totalSpent ?? 0}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link href={`/merchant/customers/${customer.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      {customer.status === "ACTIVE" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => handleBan(customer.id)}
                        >
                          حظر
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnban(customer.id)}
                        >
                          رفع الحظر
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(data?.items ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    لا يوجد عملاء
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            صفحة {data?.page ?? 1}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
