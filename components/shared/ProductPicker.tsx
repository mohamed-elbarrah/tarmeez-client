"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetProductsQuery } from "@/lib/services/productsApi";

/* ─── Props ─── */
interface SingleProps {
  mode: "single";
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface MultiProps {
  mode: "multi";
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

type ProductPickerProps = SingleProps | MultiProps;

/* ─── Component ─── */
export default function ProductPicker(props: ProductPickerProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetProductsQuery("ACTIVE");
  const products = data?.products ?? [];

  const getLabel = (id: string) => {
    const p = products.find((p) => p.id === id);
    return p ? p.name : id.slice(0, 12) + "…";
  };

  /* ─── Single mode ─── */
  if (props.mode === "single") {
    const { value, onChange, placeholder = "اختر منتجاً", disabled } = props;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal h-10",
              !value && "text-muted-foreground",
            )}
          >
            {value ? (
              <span className="flex items-center gap-2 truncate min-w-0">
                <Package className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{getLabel(value)}</span>
              </span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ms-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command>
            <CommandInput placeholder="بحث في المنتجات…" />
            <CommandList>
              {isLoading ? (
                <div className="p-2 space-y-1.5">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <CommandEmpty>لا توجد منتجات نشطة</CommandEmpty>
              )}
              <CommandGroup>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => {
                      onChange(product.id === value ? "" : product.id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-6 w-6 rounded object-cover shrink-0"
                      />
                    ) : (
                      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="flex-1 truncate text-sm">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {product.price} ر.س
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0 transition-opacity",
                        value === product.id
                          ? "opacity-100 text-primary"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  /* ─── Multi mode ─── */
  const { value, onChange, placeholder = "اختر منتجات", disabled } = props;

  const toggle = (id: string) =>
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal h-10",
              value.length === 0 && "text-muted-foreground",
            )}
          >
            {value.length === 0 ? placeholder : `${value.length} منتج محدد`}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ms-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command>
            <CommandInput placeholder="بحث في المنتجات…" />
            <CommandList>
              {isLoading ? (
                <div className="p-2 space-y-1.5">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <CommandEmpty>لا توجد منتجات نشطة</CommandEmpty>
              )}
              <CommandGroup>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => toggle(product.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-6 w-6 rounded object-cover shrink-0"
                      />
                    ) : (
                      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="flex-1 truncate text-sm">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {product.price} ر.س
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0 transition-opacity",
                        value.includes(product.id)
                          ? "opacity-100 text-primary"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((id) => (
            <Badge key={id} variant="secondary" className="gap-1 text-xs pe-1">
              <Package className="h-3 w-3 opacity-60" />
              {getLabel(id)}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== id))}
                className="rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
