interface SceneStageImageProps {
  src: string
  alt: string
}

export default function SceneStageImage({ src, alt }: SceneStageImageProps) {
  return <img className="scene-stage__image" src={src} alt={alt} width={1920} height={1440} />
}
