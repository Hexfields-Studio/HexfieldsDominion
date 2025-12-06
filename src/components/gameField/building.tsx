// src/components/gameField/Building.tsx
import { useEffect, useState } from "react";
import { Image } from "react-konva";

interface BuildingProps {
    x: number;
    y: number;
    rotation: number; // degrees
    src: string;
    width?: number;
    height?: number;
    scale?: number;
}

export const Building: React.FC<BuildingProps> =
    ({x, y, rotation, src, width = 48, height = 32, scale = 1}) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const i = new window.Image();
    i.src = src;
    i.onload = () => setImg(i);
  }, [src]);


  if (!img) {
    return null;
  }
  return (
    <Image
      image={img}
      x={x}
      y={y}
      rotation={rotation}
      offsetX={width / 2}
      offsetY={height / 2}
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      listening // set to false if you don't want interaction
    />
  );
}