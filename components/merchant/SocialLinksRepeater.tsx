"use client";

import { Plus, X, Globe, Facebook, Instagram, Twitter, Youtube, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AssetUploader } from "./AssetUploader";

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface SocialLinksRepeaterProps {
  value: SocialLink[];
  onChange: (value: SocialLink[]) => void;
  disabled?: boolean;
}

const PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "x", name: "X (Twitter)", icon: Twitter },
  { id: "youtube", name: "YouTube", icon: Youtube },
  { id: "tiktok", name: "TikTok", icon: Hash },
  { id: "other", name: "أخرى", icon: Globe },
];

export function SocialLinksRepeater({
  value = [],
  onChange,
  disabled,
}: SocialLinksRepeaterProps) {
  const addLink = () => {
    onChange([...value, { platform: "facebook", url: "" }]);
  };

  const removeLink = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, updates: Partial<SocialLink>) => {
    onChange(value.map((link, i) => (i === index ? { ...link, ...updates } : link)));
  };

  return (
    <div className="space-y-4">
      {value.map((link, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 bg-muted/20 p-4 rounded-xl border border-border group animate-in slide-in-from-top-1 duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Select
                  value={link.platform}
                  onValueChange={(platform) => updateLink(index, { platform })}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full bg-background min-w-[140px]">
                    <SelectValue placeholder="اختر المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <p.icon className="w-4 h-4 text-muted-foreground" />
                          <span>{p.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {link.platform === "other" && (
                  <AssetUploader
                    variant="compact"
                    value={link.icon}
                    onChange={(icon) => updateLink(index, { icon: icon || undefined })}
                    disabled={disabled}
                    className="shrink-0"
                  />
                )}
              </div>

              <Input
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateLink(index, { url: e.target.value })}
                dir="ltr"
                disabled={disabled}
                className="bg-background"
              />
            </div>

            {!disabled && (
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={() => removeLink(index)}
                className="text-destructive hover:bg-destructive/10 shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}


      {!disabled && (
        <Button
          type="button"
          variant="outline"
          onClick={addLink}
          className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5 gap-2 h-11"
        >
          <Plus className="w-4 h-4" />
          إضافة منصة جديدة
        </Button>
      )}

      {value.length === 0 && (
        <div className="text-center py-8 bg-muted/10 rounded-xl border border-dashed border-border">
          <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-xs text-muted-foreground">لم يتم إضافة أي روابط تواصل اجتماعي بعد</p>
        </div>
      )}
    </div>
  );
}
