import type { StructureType } from "@/repository/MatchRepository";
import { useEffect, useState, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import Konva from "konva";

export interface StructureCompProps {
    type: StructureType
    x: number;
    y: number;
    rotation: number; // degrees
    src: string;
    width?: number;
    height?: number;
    scale?: number;
    playerHue?: number; // Hue value (0-360)
}

export const StructureComp: React.FC<StructureCompProps> =
    ({ x, y, rotation, src, width = 48, height = 32, scale = 1, playerHue }) => {
      const [img, setImg] = useState<HTMLImageElement | null>(null);
      const imageRef = useRef<Konva.Image>(null);

      useEffect(() => {
        const i = new window.Image();
        i.src = src;
        i.onload = () => setImg(i);
      }, [src]);

      useEffect(() => {
        if (imageRef.current && img) {
          imageRef.current.filters([Konva.Filters.HSV]);
          if (!playerHue) {
            // Apply grayscale filter for missing color (error state)
            imageRef.current.filters([Konva.Filters.Grayscale]);
            imageRef.current.cache();
          } else {
            // Apply hue rotation filter based on playerHue using HSV filter
            imageRef.current.hue(360-playerHue);
            imageRef.current.saturation(1); // Full saturation
            imageRef.current.cache();
          }
        }
      }, [playerHue, img]);

      if (!img) {
        return null;
      }

      return (
        <KonvaImage
          ref={imageRef}
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
          listening
        />
      );
    };