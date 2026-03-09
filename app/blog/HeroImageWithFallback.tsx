"use client";

import Image from "next/image";
import { useState } from "react";
import { HERO_IMAGE_URL } from "@/lib/site-constants";

interface Props {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export default function HeroImageWithFallback({
  src,
  alt,
  fill = true,
  sizes = "100vw",
  quality = 80,
  className,
  style,
  priority,
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      quality={quality}
      className={className}
      style={style}
      priority={priority}
      onError={() => setImgSrc(HERO_IMAGE_URL)}
    />
  );
}
