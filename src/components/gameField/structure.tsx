import type { StructureType } from "@/repository/MatchRepository";
import { useEffect, useState, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { hexToHue } from "@/utils/colorUtils";

export interface StructureCompProps {
    type: StructureType
    x: number;
    y: number;
    rotation: number; // degrees
    src: string;
    width?: number;
    height?: number;
    scale?: number;
    playerColor?: string; // Hex color string, e.g. "#ff0000"
}

export const StructureComp: React.FC<StructureCompProps> =
    ({ x, y, rotation, src, width = 48, height = 32, scale = 1, playerColor }) => {
      const [img, setImg] = useState<HTMLImageElement | null>(null);
      const imageRef = useRef<Konva.Image>(null);

      useEffect(() => {
        const i = new window.Image();
        i.src = src;
        i.onload = () => setImg(i);
      }, [src]);

      useEffect(() => {
        if (imageRef.current && img) {
          if (!playerColor) {
            // Apply grayscale filter for missing color (error state)
            imageRef.current.filters([Konva.Filters.Grayscale]);
            imageRef.current.cache();
          } else {
            // Apply hue rotation filter based on player color using HSL filter
            const hue = hexToHue(playerColor);
            imageRef.current.hue(hue);
            imageRef.current.saturation(1); // Full saturation
            imageRef.current.filters([Konva.Filters.HSL]);
            imageRef.current.cache();
          }
        }
      }, [playerColor, img]);

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