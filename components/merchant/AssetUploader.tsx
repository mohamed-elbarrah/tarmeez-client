"use client";

import { useState } from "react";
import { useUploadStoreImageMutation } from "@/lib/services/merchantApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AssetUploaderProps {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  aspectRatio?: "square" | "video" | "wide";
  variant?: "default" | "compact";
  className?: string;
  description?: string;
}

export function AssetUploader({
  label,
  value,
  onChange,
  disabled,
  aspectRatio = "square",
  variant = "default",
  className,
  description,
}: AssetUploaderProps) {

  const [upload, { isLoading }] = useUploadStoreImageMutation();
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (disabled) return;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await upload(formData).unwrap();
      onChange(result.url);
      toast.success("تم رفع الملف بنجاح");
    } catch (error) {
      toast.error("فشل رفع الملف. تأكد من حجم الملف ونوعه");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={cn(
          "relative group border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center overflow-hidden",
          variant === "compact" ? "w-10 h-10 rounded-md" : "bg-muted/30",
          aspectRatio === "square" && variant === "default" && "aspect-square w-32",
          aspectRatio === "video" && "aspect-video w-full max-w-sm",
          aspectRatio === "wide" && "aspect-[3/1] w-full",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={label || "Uploaded Asset"}
              fill
              className={cn("object-contain", variant === "compact" ? "p-1" : "p-2")}
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="ghost"
                  type="button"
                  size="icon"
                  className="rounded-full w-6 h-6 text-white hover:bg-white/20"
                  onClick={(e) => { e.stopPropagation(); onChange(null); }}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center p-2">
            {isLoading ? (
              <Loader2 className={cn("animate-spin text-primary", variant === "compact" ? "w-4 h-4" : "w-6 h-6")} />
            ) : (
              <>
                {variant === "default" ? (
                  <>
                    <div className="p-2 rounded-full bg-background shadow-sm border">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-primary">اضغط للرفع</p>
                      <p className="text-[8px] text-muted-foreground">أو اسحب الملف</p>
                    </div>
                  </>
                ) : (
                  <Upload className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
                )}
              </>
            )}
          </div>
        )}

        
        {!disabled && !value && (
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onFileChange}
            accept=".jpg,.jpeg,.png,.svg,.ico,.webp"
          />
        )}
      </div>
    </div>
  );
}
