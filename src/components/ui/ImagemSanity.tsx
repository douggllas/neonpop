import Image from 'next/image'
import { urlParaImagem } from '@/lib/sanity'
import { SanityImage } from '@/types'

interface Props {
  imagem: SanityImage
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function ImagemSanity({ imagem, width, height, className, priority }: Props) {
  const src = urlParaImagem(imagem).width(width).height(height).auto('format').url()

  return (
    <Image
      src={src}
      alt={imagem.alt ?? ''}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
