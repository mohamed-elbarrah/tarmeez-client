'use client'
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Mail, Eye } from "lucide-react";
import { useState } from 'react'
import { useGetCustomersQuery, useUpdateCustomerStatusMutation } from '@/lib/services/merchantApi'

export default function Customers() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetCustomersQuery({ search, status, page, limit: 20 })
  const [updateStatus] = useUpdateCustomerStatusMutation()

  const handleBan = async (id: string) => {
    await updateStatus({ id, status: 'BANNED' })
  }
  const handleUnban = async (id: string) => {
    await updateStatus({ id, status: 'ACTIVE' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">العملاء</h1>
          <p className="text-muted-foreground">إدارة قاعدة عملائك</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Mail className="w-4 h-4 ml-2" />
          إرسال حملة بريدية
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Card className="p-4">
          <div className="text-2xl font-bold mb-1">{data?.total ?? 0}</div>
          <div className="text-sm text-muted-foreground">إجمالي العملاء</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold mb-1">{data?.items?.filter((i:any)=>i.status==='ACTIVE').length ?? 0}</div>
          <div className="text-sm text-muted-foreground">العملاء النشطون</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold mb-1">{data?.items?.filter((i:any)=>i.status==='BANNED').length ?? 0}</div>
          <div className="text-sm text-muted-foreground">المحظورون</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold mb-1">{0}</div>
          <div className="text-sm text-muted-foreground">إجمالي الإنفاق</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="بحث عن عميل..." className="pr-10" value={search} onChange={(e)=>setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant={status===undefined? 'default':'outline'} onClick={()=>setStatus(undefined)}>الكل</Button>
            <Button variant={status==='ACTIVE'?'default':'outline'} onClick={()=>setStatus('ACTIVE')}>نشط</Button>
            <Button variant={status==='BANNED'?'default':'outline'} onClick={()=>setStatus('BANNED')}>محظور</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">العميل</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الموقع</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الطلبات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجمالي الإنفاق</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {(data?.items ?? []).map((customer: any) => (
                <tr key={customer.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                        <span className="font-bold text-accent-foreground">{(customer.fullName||'؟')[0]}</span>
                      </div>
                      <div>
                        <div className="font-medium">{customer.fullName}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">—</td>
                  <td className="py-4 px-4">{customer.ordersCount ?? 0}</td>
                  <td className="py-4 px-4 font-medium">{customer.totalSpent ?? 0}</td>
                  <td className="py-4 px-4">
                    <Link href={`/merchant/customers/${customer.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    {customer.status==='ACTIVE' ? (
                      <Button variant="destructive" size="sm" onClick={()=>handleBan(customer.id)} className="mr-2">حظر</Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={()=>handleUnban(customer.id)} className="mr-2">رفع الحظر</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>صفحة {data?.page ?? 1}</div>
          <div className="flex gap-2">
            <Button onClick={()=>setPage(p=>Math.max(1,p-1))}>السابق</Button>
            <Button onClick={()=>setPage(p=>p+1)}>التالي</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
