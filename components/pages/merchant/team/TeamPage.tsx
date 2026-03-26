"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Trash2,
  Clock,
  XCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import {
  useGetTeamMembersQuery,
  useGetInvitationsQuery,
  useRemoveMemberMutation,
  useCancelInvitationMutation,
  type StoreRole,
  type InvitationStatus,
} from "@/lib/services/teamApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { InviteMemberModal } from "./InviteMemberModal";
import { cn } from "@/lib/utils";

// ─── Role Labels & Colors ─────────────────────────────────────────────────────

const ROLE_LABELS: Record<StoreRole, string> = {
  OWNER: "مالك",
  ADMIN: "مدير",
  EDITOR: "محرر",
  MARKETER: "مسوّق",
};

// OKLCH-based badge colors that work in light & dark mode via CSS variables
const ROLE_STYLES: Record<StoreRole, string> = {
  OWNER:
    "bg-[oklch(0.93_0.04_262.4)] text-[oklch(0.25_0.14_262.4)] dark:bg-[oklch(0.28_0.12_262.4)] dark:text-[oklch(0.85_0.08_262.4)]",
  ADMIN:
    "bg-[oklch(0.92_0.06_142)] text-[oklch(0.25_0.12_142)] dark:bg-[oklch(0.22_0.1_142)] dark:text-[oklch(0.8_0.1_142)]",
  EDITOR:
    "bg-[oklch(0.93_0.06_60)] text-[oklch(0.3_0.1_60)] dark:bg-[oklch(0.25_0.08_60)] dark:text-[oklch(0.85_0.08_60)]",
  MARKETER:
    "bg-[oklch(0.93_0.05_300)] text-[oklch(0.3_0.12_300)] dark:bg-[oklch(0.25_0.1_300)] dark:text-[oklch(0.85_0.08_300)]",
};

const STATUS_LABELS: Record<InvitationStatus, string> = {
  PENDING: "في الانتظار",
  ACCEPTED: "مقبولة",
  EXPIRED: "منتهية",
  CANCELLED: "ملغاة",
};

const STATUS_STYLES: Record<InvitationStatus, string> = {
  PENDING:
    "bg-[oklch(0.93_0.06_60)] text-[oklch(0.35_0.1_60)] dark:bg-[oklch(0.25_0.08_60)] dark:text-[oklch(0.85_0.08_60)]",
  ACCEPTED:
    "bg-[oklch(0.92_0.06_142)] text-[oklch(0.25_0.12_142)] dark:bg-[oklch(0.22_0.1_142)] dark:text-[oklch(0.8_0.1_142)]",
  EXPIRED:
    "bg-[oklch(0.93_0.02_0)] text-[oklch(0.35_0.04_0)] dark:bg-[oklch(0.22_0.04_0)] dark:text-[oklch(0.75_0.04_0)]",
  CANCELLED:
    "bg-[oklch(0.93_0.04_27)] text-[oklch(0.35_0.15_27)] dark:bg-[oklch(0.24_0.12_27)] dark:text-[oklch(0.8_0.1_27)]",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: StoreRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        ROLE_STYLES[role],
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatusBadge({ status }: { status: InvitationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const {
    data: members = [],
    isLoading: membersLoading,
    isError: membersError,
    error: membersRawError,
    refetch: refetchMembers,
  } = useGetTeamMembersQuery();

  const {
    data: invitations = [],
    isLoading: invitationsLoading,
    isError: invitationsError,
    refetch: refetchInvitations,
  } = useGetInvitationsQuery();

  // If the backend returns 403 it means the merchant has no store yet.
  const isNoStore =
    membersError &&
    (membersRawError as FetchBaseQueryError | undefined)?.status === 403;

  const [removeMember] = useRemoveMemberMutation();
  const [cancelInvitation] = useCancelInvitationMutation();

  const handleRemoveMember = async (id: string, email: string) => {
    try {
      await removeMember(id).unwrap();
      toast.success("تم إزالة العضو", { description: email });
    } catch {
      toast.error("فشل إزالة العضو");
    }
  };

  const handleCancelInvitation = async (id: string, email: string) => {
    try {
      await cancelInvitation(id).unwrap();
      toast.success("تم إلغاء الدعوة", { description: email });
    } catch {
      toast.error("فشل إلغاء الدعوة");
    }
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "PENDING",
  );

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* ── No-store banner ── */}
      {isNoStore && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 p-6">
            <XCircle className="w-8 h-8 text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-destructive">
                لا يوجد متجر مرتبط بحسابك
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                يرجى إنشاء متجرك أولاً قبل إدارة الفريق.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة الفريق</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة أعضاء فريق المتجر وصلاحياتهم
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="w-4 h-4 ml-2" />
          دعوة عضو
        </Button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "أعضاء الفريق",
            value: membersLoading ? "—" : members.length,
            icon: Users,
          },
          {
            label: "دعوات معلقة",
            value: invitationsLoading ? "—" : pendingInvitations.length,
            icon: Clock,
          },
          {
            label: "إجمالي الدعوات",
            value: invitationsLoading ? "—" : invitations.length,
            icon: Mail,
          },
        ].map((stat) => (
          <Card key={stat.label}>
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

      {/* ── Active Members Table ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ShieldCheck className="w-5 h-5 text-primary" />
            الأعضاء النشطون
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {membersError ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <p className="text-sm text-muted-foreground">
                فشل تحميل بيانات الفريق
              </p>
              <Button variant="outline" size="sm" onClick={refetchMembers}>
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">
                    البريد الإلكتروني
                  </TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">تاريخ الانضمام</TableHead>
                  <TableHead className="text-right w-16">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersLoading ? (
                  <TableSkeleton rows={3} />
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-muted-foreground"
                    >
                      لا يوجد أعضاء في الفريق بعد
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-primary uppercase">
                              {member.user.email[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium" dir="ltr">
                            {member.user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={member.role} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(member.createdAt), {
                          addSuffix: true,
                          locale: ar,
                        })}
                      </TableCell>
                      <TableCell>
                        {member.role !== "OWNER" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  إزالة العضو من الفريق؟
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيفقد <strong>{member.user.email}</strong>{" "}
                                  الوصول إلى المتجر فوراً. هذا الإجراء لا يمكن
                                  التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-row-reverse gap-2">
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() =>
                                    handleRemoveMember(
                                      member.id,
                                      member.user.email,
                                    )
                                  }
                                >
                                  إزالة
                                </AlertDialogAction>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Invitations Table ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Mail className="w-5 h-5 text-primary" />
            الدعوات المُرسلة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invitationsError ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <p className="text-sm text-muted-foreground">فشل تحميل الدعوات</p>
              <Button variant="outline" size="sm" onClick={refetchInvitations}>
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">
                    البريد الإلكتروني
                  </TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">تاريخ الإرسال</TableHead>
                  <TableHead className="text-right">حالة الدعوة</TableHead>
                  <TableHead className="text-right w-16">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitationsLoading ? (
                  <TableSkeleton rows={3} />
                ) : invitations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      لم يتم إرسال أي دعوات بعد
                    </TableCell>
                  </TableRow>
                ) : (
                  invitations.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm" dir="ltr">
                            {inv.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={inv.role} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(inv.createdAt), {
                          addSuffix: true,
                          locale: ar,
                        })}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell>
                        {inv.status === "PENDING" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  إلغاء الدعوة؟
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيتم إلغاء الدعوة المرسلة إلى{" "}
                                  <strong>{inv.email}</strong> ولن تصلح رابط
                                  القبول بعد الآن.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-row-reverse gap-2">
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() =>
                                    handleCancelInvitation(inv.id, inv.email)
                                  }
                                >
                                  إلغاء الدعوة
                                </AlertDialogAction>
                                <AlertDialogCancel>تراجع</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Invite Modal ── */}
      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
}
