"use client";

import React from "react";

interface DonationProgressBarProps {
  progressBarPercent: number;
  progressMessage?: string;
  goalDisplay?: string;
  collectedDisplay?: string;
}

export default function DonationProgressBar({
  progressBarPercent,
  progressMessage,
  goalDisplay,
  collectedDisplay,
}: DonationProgressBarProps) {
  const resolvedProgressMessage =
    progressMessage ||
    (progressBarPercent === 0
      ? "كن أول مبادر"
      : `${progressBarPercent}% تم تحقيق الهدف`);

  return (
    <div className="mb-8 mt-auto">
      <div
        className="progress-bar w-full h-5 bg-gray-100 relative overflow-hidden"
        style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
      >
        <div
          className="progress-bar-fill h-full absolute top-0 right-0 bg-(--p-color)"
          style={{ borderRadius: "100px", width: `${progressBarPercent}%` }}
        />
        <div className="progress-overlay absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <span className="text-[10px] font-bold text-gray-600 z-10">
            {resolvedProgressMessage}
          </span>
          <span className="text-[10px] font-black text-(--p-color) z-10 tabular-nums">
            {progressBarPercent}%
          </span>
        </div>
      </div>

      {/* Target / Collected */}
      {goalDisplay && (
        <div className="target-badge-inline flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400">تم جمع</span>
            <span className="text-xs font-black text-(--p-color)">
              {collectedDisplay || "0 ر.س"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400">الهدف</span>
            <span className="text-xs font-black text-gray-800">
              {goalDisplay}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
