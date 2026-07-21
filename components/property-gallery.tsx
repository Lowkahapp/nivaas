"use client"

import Image from "next/image"
import { useState } from "react"

export function PropertyGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="grid gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:h-[420px]">
      <div className="relative overflow-hidden rounded-2xl sm:col-span-3 sm:row-span-2">
        <Image
          src={images[active] || "/placeholder.svg"}
          alt={`${name} — photo ${active + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-3 sm:col-span-1 sm:grid-cols-1 sm:grid-rows-4">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i)}
            aria-label={`View photo ${i + 1}`}
            aria-current={active === i}
            className={`relative aspect-video overflow-hidden rounded-xl transition-all sm:aspect-auto ${
              active === i ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100"
            }`}
          >
            <Image
              src={img || "/placeholder.svg"}
              alt={`${name} thumbnail ${i + 1}`}
              fill
              sizes="20vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
