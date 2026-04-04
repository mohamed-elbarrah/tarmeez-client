"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";

interface Props {
  storeSlug: string;
  orderCode?: string;
}

/**
 * Charity-specific order success page — spiritual messaging, no shipping tracking.
 * Always shows donation confirmation regardless of URL params.
 */
export default function CharityOrderSuccessPage({
  storeSlug,
  orderCode,
}: Props) {
  const params = useSearchParams();
  const code = orderCode || params.get("code") || "";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-12 text-center border rounded-2xl shadow-sm">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
            <Heart size={48} fill="currentColor" />
          </div>
        </div>
        <h1 className="text-3xl font-black mb-4">
          تقبل الله طاعتك وزادك من فضله
        </h1>
        <p className="text-slate-500 font-bold mb-6">
          تم قبول مساهمتكم بفضل الله 💚
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 text-right">
          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
            رقم التبرع: <div className="font-black text-lg">#{code}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
            تاريخ التبرع:{" "}
            <div className="font-black text-lg">
              {new Date().toLocaleDateString("ar-SA-u-nu-latn", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <Link
          href={`/store/${storeSlug}`}
          className="px-8 py-4 bg-[var(--p-color)] text-white rounded-xl font-bold inline-block hover:shadow-lg transition-all"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
