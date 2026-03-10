"use client"

import React, { useState } from 'react'
import { useGetMerchantsQuery, useApproveMerchantMutation, useRejectMerchantMutation } from '@/lib/services/superadminApi'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'

const statusMap: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'default' },> = {
  PENDING: { label: 'قيد الانتظار', variant: 'secondary' },
  ACTIVE: { label: 'مفعّل', variant: 'default' },
  REJECTED: { label: 'مرفوض', variant: 'destructive' },
}

export default function SuperadminMerchantsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined)
  const { data: merchants, isLoading } = useGetMerchantsQuery(selectedStatus)
  const [approve] = useApproveMerchantMutation()
  const [reject] = useRejectMerchantMutation()
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    try {
      await approve(id).unwrap()
      toast.success('تمت الموافقة بنجاح')
    } catch (err) {
      toast.error('فشل في الموافقة')
    }
  }

  const handleReject = async () => {
    if (!rejectingId) return
    try {
      await reject(rejectingId).unwrap()
      setRejectingId(null)
      toast.success('تم الرفض')
    } catch (err) {
      toast.error('فشل في الرفض')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Tabs defaultValue="all" dir="rtl">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setSelectedStatus(undefined)}>الكل</TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setSelectedStatus('PENDING')}>قيد الانتظار</TabsTrigger>
            <TabsTrigger value="active" onClick={() => setSelectedStatus('ACTIVE')}>مفعّل</TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => setSelectedStatus('REJECTED')}>مرفوض</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
        </div>
      ) : (!merchants || merchants.length === 0) ? (
        <div className="text-center p-8 text-muted-foreground">لا توجد تاجر</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>المتجر</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>الدولة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.map((m: any) => (
              <TableRow key={m.id}>
                <TableCell>{m.fullName}</TableCell>
                <TableCell>{m.storeName}</TableCell>
                <TableCell>{m.category}</TableCell>
                <TableCell>{m.country}</TableCell>
                <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge>{statusMap[m.status]?.label ?? m.status}</Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  {m.status === 'PENDING' && (
                    <>
                      <Button onClick={() => handleApprove(m.id)} className="bg-green-600">✓ موافقة</Button>

                      <Dialog open={!!rejectingId && rejectingId === m.id}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" onClick={() => setRejectingId(m.id)}>✗ رفض</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تأكيد الرفض</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>هل أنت متأكد من رفض هذا التاجر؟</DialogDescription>
                          <DialogFooter>
                            <Button variant="ghost" onClick={() => setRejectingId(null)}>إلغاء</Button>
                            <Button variant="destructive" onClick={handleReject}>تأكيد الرفض</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}


// import Page from "@/components/pages/superadmin/MerchantsManagement";

// export default function RoutePage() {
//   return <Page />;
// }
