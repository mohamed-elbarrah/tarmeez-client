"use client";

import React from "react";
import { useCharityCheckoutContext } from "./CharityCheckoutContext";
import { charityFieldToFormKey } from "./useCharityCheckoutFlow";

/**
 * Renders donor contact fields dynamically based on merchant config.
 * Strips address/shipping entirely — donations are amount-based.
 * Includes the "Anonymous" toggle.
 */
export default function CharityDonorForm() {
  const { register, errors, checkoutFields, isAnonymous, setIsAnonymous } =
    useCharityCheckoutContext();

  const inputTypeMap: Record<string, string> = {
    phone: "tel",
    email: "email",
  };

  const visibleFields = checkoutFields.filter((f) => f.enabled);

  return (
    <div className="bg-white p-8 border rounded-lg">
      <h2 className="text-lg font-black mb-4">بيانات المتبرع</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {visibleFields.map((field) => {
          const formKey = charityFieldToFormKey(field.id);
          const errMsg = (errors as any)[formKey]?.message as
            | string
            | undefined;

          if (field.type === "textarea") {
            return (
              <div key={field.id} className="md:col-span-2 space-y-1">
                <textarea
                  {...(register as any)(formKey)}
                  placeholder={field.placeholder || field.label}
                  className={`w-full p-3 bg-slate-50 border rounded-lg h-24 ${errMsg ? "border-red-500" : "border-slate-200"}`}
                />
                {errMsg && (
                  <p className="text-red-500 text-[10px] pr-2">{errMsg}</p>
                )}
              </div>
            );
          }

          const inputType = inputTypeMap[field.type] ?? "text";
          return (
            <div key={field.id} className="space-y-1">
              <input
                {...(register as any)(formKey)}
                type={inputType}
                placeholder={field.placeholder || field.label}
                className={`w-full p-3 bg-slate-50 border rounded-lg ${errMsg ? "border-red-500" : "border-slate-200"}`}
              />
              {errMsg && (
                <p className="text-red-500 text-[10px] pr-2">{errMsg}</p>
              )}
            </div>
          );
        })}

        {/* Notes always last */}
        <div className="md:col-span-2 space-y-1">
          <textarea
            {...(register as any)("notes")}
            placeholder="ملاحظات (اختياري)"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-16"
          />
        </div>
      </div>

      {/* Anonymous donation toggle */}
      <div className="mt-4 flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
        <input
          type="checkbox"
          id="charity-anonymous-donation"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-5 h-5 cursor-pointer accent-[var(--p-color)]"
        />
        <label
          htmlFor="charity-anonymous-donation"
          className="font-bold text-sm text-green-800 cursor-pointer"
        >
          التبرع كفاعل خير (بدون ذكر الاسم)
        </label>
      </div>
    </div>
  );
}
