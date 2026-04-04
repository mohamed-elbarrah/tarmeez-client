"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeTokens, StoreCategory } from "@/lib/themes/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props {
  theme: ThemeTokens;
  storeSlug: string;
  categories?: StoreCategory[];
}

export default function CategoriesSlider({
  theme,
  storeSlug,
  categories,
}: Props) {
  const cats =
    categories && categories.length > 0
      ? categories
      : [
          { id: "1", name: "جوالات", slug: "phones", sortOrder: 0 },
          { id: "2", name: "ساعات", slug: "watches", sortOrder: 1 },
          { id: "3", name: "عطور", slug: "perfumes", sortOrder: 2 },
          { id: "4", name: "جمال", slug: "beauty", sortOrder: 3 },
          { id: "5", name: "منزل", slug: "home", sortOrder: 4 },
          { id: "6", name: "موضة", slug: "clothing", sortOrder: 5 },
        ];

  return (
    <section className="relative px-2">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black">تسوق حسب الفئة</h2>
        <Link
          href={`/store/${storeSlug}/products`}
          className="text-sm font-bold text-[var(--p-color)]"
        >
          عرض الكل
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          direction: "rtl",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {cats.map((cat, i) => (
            <CarouselItem
              key={cat.id}
              className="pl-4 basis-1/3 sm:basis-1/6 md:basis-1/4 lg:basis-1/10"
            >
              <Link
                href={`/store/${storeSlug}/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-full bg-white border flex items-center justify-center group-hover:border-[var(--p-color)] group-hover:shadow-md transition-all relative overflow-hidden">
                  <Image
                    src={
                      cat.image ||
                      `https://cdn-icons-png.flaticon.com/512/3659/${3659899 + i}.png`
                    }
                    alt={cat.name}
                    fill
                    unoptimized={cat.image?.startsWith("https://placehold.co")}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-bold text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-right-12" />
          <CarouselNext className="-left-12" />
        </div>
      </Carousel>
    </section>
  );
}
