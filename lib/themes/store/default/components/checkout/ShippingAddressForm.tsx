"use client";

import React from "react";
import { useCheckoutContext } from "./CheckoutContext";
import { fieldToFormKey } from "./useCheckoutFlow";
import type { CheckoutFieldConfig } from "@/lib/types/auth";

// ─── Input primitive ──────────────────────────────────────────────────────────

interface FieldInputProps {
  formKey: string;
  placeholder?: string;
  type?: string;
  register: ReturnType<typeof useCheckoutContext>["register"];
  error?: string;
  colSpan?: "full" | "half";
}

function FieldInput({
  formKey,
  placeholder,
  type = "text",
  register,
  error,
  colSpan = "half",
}: FieldInputProps) {
  return (
    <div className={`space-y-1${colSpan === "full" ? " md:col-span-2" : ""}`}>
      <input
        {...(register as any)(formKey)}
        type={type}
        placeholder={placeholder}
        className={`w-full p-3 bg-slate-50 border rounded-lg ${error ? "border-red-500" : "border-slate-200"}`}
      />
      {error && <p className="text-red-500 text-[10px] pr-2">{error}</p>}
    </div>
  );
}

// ─── Address compound field ──────────────────────────────────────────────────

function AddressFields({
  field,
  register,
  errors,
}: {
  field: CheckoutFieldConfig;
  register: ReturnType<typeof useCheckoutContext>["register"];
  errors: ReturnType<typeof useCheckoutContext>["errors"];
}) {
  return (
    <>
      <FieldInput
        formKey="city"
        placeholder="المدينة"
        register={register}
        error={errors.city?.message as string | undefined}
      />
      <FieldInput
        formKey="region"
        placeholder="المنطقة / الحي"
        register={register}
        error={errors.region?.message as string | undefined}
      />
      <FieldInput
        formKey="street"
        placeholder={field.placeholder || "الشارع والرقم"}
        register={register}
        error={errors.street?.message as string | undefined}
        colSpan="full"
      />
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Pure loop — renders form fields by iterating checkoutFields from context.
 * Zero hardcoded field names. The only logic is mapping field.id to the
 * correct <input type> and handling the special `address` compound field.
 */
export default function ShippingAddressForm() {
  const { register, errors, checkoutFields } = useCheckoutContext();

  const visibleFields = checkoutFields.filter((f) => f.enabled);

  const inputTypeMap: Record<string, string> = {
    phone: "tel",
    email: "email",
    textarea: "text", // rendered as input for simplicity; textarea handled below
  };

  return (
    <div className="bg-white p-8 border rounded-lg">
      <h2 className="text-lg font-black mb-4">بيانات الطلب</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {visibleFields.map((field) => {
          // Address is a compound field rendered as three sub-inputs
          if (field.id === "address") {
            return (
              <React.Fragment key="address">
                <AddressFields
                  field={field}
                  register={register}
                  errors={errors}
                />
              </React.Fragment>
            );
          }

          // Textarea type
          if (field.type === "textarea") {
            const formKey = fieldToFormKey(field.id);
            const errMsg = (errors as any)[formKey]?.message as
              | string
              | undefined;
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

          // All other field types → single input
          const formKey = fieldToFormKey(field.id);
          const errMsg = (errors as any)[formKey]?.message as
            | string
            | undefined;
          const inputType = inputTypeMap[field.type] ?? "text";

          return (
            <FieldInput
              key={field.id}
              formKey={formKey}
              placeholder={field.placeholder || field.label}
              type={inputType}
              register={register}
              error={errMsg}
            />
          );
        })}

        {/* Notes always appears last */}
        <div className="md:col-span-2 space-y-1">
          <textarea
            {...(register as any)("notes")}
            placeholder="ملاحظات (اختياري)"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-16"
          />
        </div>
      </div>
    </div>
  );
}
