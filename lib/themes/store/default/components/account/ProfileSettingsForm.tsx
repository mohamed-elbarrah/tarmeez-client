"use client";

import React from "react";
import { useAccountContext } from "./AccountContext";

/**
 * Dumb organism — display-only profile settings panel.
 * Reads profile from AccountContext; no edit functionality needed yet.
 */
export default function ProfileSettingsForm() {
  const { profile } = useAccountContext();

  return (
    <div>
      <h2 className="text-3xl font-black mb-6">إعدادات الحساب</h2>
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">
              الاسم الكامل
            </label>
            <div className="p-4 bg-gray-50 rounded-xl font-bold text-sm">
              {profile?.fullName ?? "---"}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">
              البريد الإلكتروني
            </label>
            <div className="p-4 bg-gray-50 rounded-xl font-bold text-sm">
              {profile?.email ?? "---"}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">
              رقم الجوال
            </label>
            <div className="p-4 bg-gray-50 rounded-xl font-bold text-sm">
              {profile?.phone ?? "---"}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">
              تاريخ التسجيل
            </label>
            <div className="p-4 bg-gray-50 rounded-xl font-bold text-sm">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "---"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
