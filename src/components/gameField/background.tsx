import { useEffect, useState } from "react";
import { Image } from "react-konva";

interface BackgroundProps {
  imagePath: string;
  tileSize?: number;
  gridSize?: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export const Background: React.FC<BackgroundProps> = ({ imagePath, tileSize = 1024, gridSize = 1, scale = 1, offsetX = 0, offsetY = 0 }) => {
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const scaledTileSize = tileSize * scale;

  useEffect(() => {
    const img = new window.Image();
    img.src = `${import.meta.env.BASE_URL}${imagePath}`;
    img.onload = () => setBackgroundImage(img);
  }, [imagePath]);

  if (!backgroundImage) return null;

  const tiles = []; // Array to hold tile components
  
  // Normalize offset value to [0, scaledTileSize) range for smooth wraparound
  const normalizedOffsetX = ((offsetX % scaledTileSize) + scaledTileSize) % scaledTileSize;
  const normalizedOffsetY = ((offsetY % scaledTileSize) + scaledTileSize) % scaledTileSize;

  // Position tiles with normalized offset for scrolling effect
  for (let row = -1; row <= gridSize + 1; row++) {
    for (let col = -1; col <= gridSize + 1; col++) {
      tiles.push(
        <Image
          key={`bg-${row}-${col}`}
          image={backgroundImage}
          x={(col - gridSize / 2) * scaledTileSize - normalizedOffsetX}
          y={(row - gridSize / 2) * scaledTileSize - normalizedOffsetY}
          width={scaledTileSize}
          height={scaledTileSize}
        />,
      );
    }
  }

  return <>{tiles}</>;
};
