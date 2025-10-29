"use client";

import React, { useState } from "react";
import Image from "next/image";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src?: string;
  alt: string;
}

export function ImageWithFallback({
  src,
  alt,
  style,
  className,
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  if (didError || !src) {
    return (
      <div
        className={`relative inline-block bg-gray-100 text-center align-middle ${
          className ?? ""
        }`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <Image
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            data-original-url={src}
            width={88}
            height={88}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={style} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
      />
    </div>
  );
}
