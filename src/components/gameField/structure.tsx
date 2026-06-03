import type { AxialPosition, StructureType } from "@/repository/MatchRepository";
import { useEffect, useState, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import Konva from "konva";

export interface StructureCompProps {
    type: StructureType;
    ownerId: number;
    x: number;
    y: number;
    rotation?: number; // degrees
    src: string;
    width?: number;
    height?: number;
    scale?: number;
    playerHue?: number; // Hue value (0-360)
    onClick?: ()=>void;
    adjacentHexes: AxialPosition[];
}

export const StructureComp: React.FC<StructureCompProps> =
    ({ x, y, rotation = 0, src, width = 48, height = 32, scale = 1, playerHue, onClick = ()=>{}}) => {
      const [img, setImg] = useState<HTMLImageElement | null>(null);
      const imageRef = useRef<Konva.Image>(null);

      useEffect(() => {
        const i = new window.Image();
        i.src = src;
        i.onload = () => setImg(i);
        return () => setImg(null);
      }, [src]);

      useEffect(() => {
        const image = imageRef.current;

        if (!image || !img) return;

        image.filters([Konva.Filters.HSV]);
        if (!playerHue) {
          // Apply grayscale filter for missing color (error state)
          image.filters([Konva.Filters.Grayscale]);
        } else {
          // Apply hue rotation filter based on playerHue using HSV filter
          image.hue(360-playerHue);
          image.saturation(1); // Full saturation
        }
        image.cache();
        image.getLayer()?.batchDraw();
        return () => {
          image.clearCache();
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
          onClick={onClick}
        />
      );
    };