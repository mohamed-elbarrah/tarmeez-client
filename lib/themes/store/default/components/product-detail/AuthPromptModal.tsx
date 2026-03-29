"use client";

import React from "react";
import { Star, Heart } from "lucide-react";
import type { AuthModalType } from "./useProductActions";

interface AuthPromptModalProps {
  /** Drives the icon and copy shown inside the modal */
  type: AuthModalType;
  onLogin: () => void;
  onRegister: () => void;
  onClose: () => void;
}

/**
 * Dumb widget — renders a "login required" dialog.
 * Receives all handlers via props; owns zero state/logic.
 * Serializable: all props are primitives or stable function refs.
 */
export default function AuthPromptModal({
  type,
  onLogin,
  onRegister,
  onClose,
}: AuthPromptModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white p-8 max-w-sm w-full text-center space-y-6"
        style={{ borderRadius: "calc(var(--radius) * 2)" }}
      >
        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
          {type === "review" ? (
            <Star size={32} className="text-amber-400" fill="currentColor" />
          ) : (
            <Heart size={32} className="text-red-400" />
          )}
        </div>

        <div>
          <h3 className="text-xl font-black mb-2">
            {type === "review" ? "أضف تقييمك" : "أضف للمفضلة"}
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            {type === "review"
              ? "يجب تسجيل الدخول أو إنشاء حساب لمشاركة تجربتك مع المنتج"
              : "يجب تسجيل الدخول أو إنشاء حساب لحفظ المنتجات في مفضلتك"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onLogin}
            className="flex-1 py-3 text-white font-black rounded-xl"
            style={{ backgroundColor: "var(--p-color)" }}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-600 font-black rounded-xl"
          >
            لاحقاً
          </button>
        </div>

        <button
          onClick={onRegister}
          className="text-sm font-bold underline"
          style={{ color: "var(--p-color)" }}
        >
          إنشاء حساب جديد
        </button>
      </div>
    </div>
  );
}
