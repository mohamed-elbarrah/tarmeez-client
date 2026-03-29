"use client";

import React, { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import ProductImage from "@/lib/themes/store/default/components/ProductImage";
import { WidgetProductCardProps } from "@/lib/themes/types";

export default function CharityProductCard({
  id,
  title,
  imageUrl,
  displayPrice,
  primaryActionText,
  primaryActionIcon,
  productUrl,
  progressBarPercent = 0,
  progressMessage,
  goalDisplay,
  collectedDisplay,
  donationPresets = [10, 50, 100],
  allowCustomAmount = true,
  onPrimaryAction,
}: WidgetProductCardProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(donationPresets[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
  };

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const finalAmount = isCustom ? parseFloat(customValue) : selectedAmount;
    onPrimaryAction({ amount: finalAmount || 0 });
  };

  // Limit to 4 items in the grid (Constraint 2)
  const presetsToShow = donationPresets.slice(0, 3);

  return (
    <div
      className="group bg-white p-5 border border-emerald-50 hover:shadow-2xl transition-all relative flex flex-col h-full"
      style={{ borderRadius: "var(--radius)" }}
    >
      <Link href={productUrl} className="flex flex-col h-full">
        {/* Image Section */}
        <div
          className="aspect-square mb-5 overflow-hidden relative bg-emerald-50/30 p-8"
          style={{ borderRadius: "calc(var(--radius) * 1)" }}
        >
          <ProductImage
            src={imageUrl}
            alt={title}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 right-3 z-20">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 shadow-xl backdrop-blur-md bg-white/90"
            >
              <Sparkles size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black text-gray-800 uppercase tracking-tight">
                مشروع خيري
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-md font-black line-clamp-2 h-12 mb-4 leading-tight group-hover:text-emerald-600 transition-colors px-1"
          style={{ color: "var(--h-color)" }}
        >
          {title}
        </h3>

        {/* The Talking Bar (Constraint 2.1) */}
        <div className="mb-6 px-1">
          <div
            className="w-full h-8 bg-gray-100 relative overflow-hidden"
            style={{ borderRadius: "100px" }}
          >
            {/* Progress Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressBarPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full absolute top-0 right-0 bg-emerald-500"
              style={{ borderRadius: "100px" }}
            />
            {/* The Message Inside */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-gray-700 z-10 drop-shadow-sm">
                {progressMessage || `${progressBarPercent}% تم تحقيق الهدف`}
              </span>
            </div>
          </div>
        </div>

        {/* Dual Info Cards (Constraint 2.2) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/50 text-center">
            <span className="block text-[9px] font-black text-emerald-600 mb-1 uppercase tracking-widest">تم جمع</span>
            <span className="block text-xs font-black text-gray-800">{collectedDisplay || "0"}</span>
          </div>
          <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50 text-center">
            <span className="block text-[9px] font-black text-gray-400 mb-1 uppercase tracking-widest">الهدف</span>
            <span className="block text-xs font-black text-gray-800">{goalDisplay || "—"}</span>
          </div>
        </div>

        {/* 4-Preset Grid (Constraint 2.3) */}
        <div className="grid grid-cols-2 gap-2 mb-6" onClick={(e) => e.preventDefault()}>
          {presetsToShow.map((amt) => (
            <button
              key={amt}
              onClick={() => handlePresetClick(amt)}
              className={`py-3 text-xs font-black transition-all border-2 ${
                !isCustom && selectedAmount === amt
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]"
                  : "bg-white text-gray-500 border-gray-100 hover:border-emerald-200"
              }`}
              style={{ borderRadius: "calc(var(--radius) * 0.75)" }}
            >
              {amt} ر.س
            </button>
          ))}
          {allowCustomAmount ? (
            <button
              onClick={handleCustomClick}
              className={`py-3 text-xs font-black transition-all border-2 ${
                isCustom
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]"
                  : "bg-white text-gray-500 border-gray-100 hover:border-emerald-200"
              }`}
              style={{ borderRadius: "calc(var(--radius) * 0.75)" }}
            >
              مبلغ مخصص
            </button>
          ) : (
             donationPresets[3] && (
              <button
                onClick={() => handlePresetClick(donationPresets[3])}
                className={`py-3 text-xs font-black transition-all border-2 ${
                  !isCustom && selectedAmount === donationPresets[3]
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]"
                    : "bg-white text-gray-500 border-gray-100 hover:border-emerald-200"
                }`}
                style={{ borderRadius: "calc(var(--radius) * 0.75)" }}
              >
                {donationPresets[3]} ر.س
              </button>
            )
          )}
        </div>

        {/* Custom Input (Only shown if isCustom is true) */}
        {isCustom && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative"
            onClick={(e) => e.preventDefault()}
          >
            <input
              type="number"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="أدخل المبلغ..."
              className="w-full h-12 bg-gray-50 border-2 border-emerald-100 focus:border-emerald-500 outline-none pr-4 pl-12 text-sm font-black transition-all"
              style={{ borderRadius: "calc(var(--radius) * 0.75)" }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">ر.س</span>
          </motion.div>
        )}

        {/* Primary Action Button */}
        <button
          onClick={handleAction}
          className="w-full py-4 text-white font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all hover:brightness-110 active:scale-95 group/btn"
          style={{
            backgroundColor: "var(--p-color)",
            borderRadius: "calc(var(--radius) * 0.75)",
          }}
        >
          {primaryActionIcon || <Heart size={18} fill="currentColor" className="group-hover/btn:scale-125 transition-transform" />}
          {primaryActionText}
        </button>
      </Link>
    </div>
  );
}
