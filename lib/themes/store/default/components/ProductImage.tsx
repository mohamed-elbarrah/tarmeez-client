import React from 'react'
import Image from 'next/image'

interface Props {
  src?: string | null
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
}

const getImageSrc = (image: string | undefined | null) => {
  if (!image) return '/placeholder-product.png'
  if (image.startsWith('data:')) return image
  if (image.startsWith('http')) return image
  return '/placeholder-product.png'
}

export default function ProductImage({ 
    src, 
    alt, 
    className = '', 
    fill = false, 
    width, 
    height, 
    priority = false,
    sizes
}: Props) {
  const imageSrc = getImageSrc(src)
  const isBase64 = imageSrc.startsWith('data:')
  
  if (isBase64) {
    return <img src={imageSrc} alt={alt} className={className} />
  }

  // If fill is true, next/image expects no width/height
  if (fill) {
    return (
      <Image 
        src={imageSrc} 
        alt={alt} 
        fill 
        className={className} 
        priority={priority} 
        sizes={sizes}
      />
    )
  }

  return (
    <Image 
      src={imageSrc} 
      alt={alt} 
      width={width || 400} 
      height={height || 400} 
      className={className} 
      priority={priority}
      sizes={sizes}
    />
  )
}
