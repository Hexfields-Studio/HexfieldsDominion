import { useEffect, useState } from "react";
import { Image } from "react-konva";

interface BackgroundProps {
  imagePath: string;
  tileSize?: number;
  gridSize?: number;
  scale?: number;
}

export const Background: React.FC<BackgroundProps> = ({ imagePath, tileSize = 256, gridSize = 1, scale = 1 }) => {
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const scaledTileSize = tileSize * scale;

  useEffect(() => {
    const img = new window.Image();
    img.src = `${import.meta.env.BASE_URL}${imagePath}`;
    img.onload = () => setBackgroundImage(img);
  }, [imagePath]);

  if (!backgroundImage) return null;

  return (
    <>
      {Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => (
          <Image
            key={`bg-${row}-${col}`}
            image={backgroundImage}
            x={(col - gridSize / 2) * scaledTileSize}
            y={(row - gridSize / 2) * scaledTileSize}
            width={scaledTileSize}
            height={scaledTileSize}
          />
        ))
      )}
    </>
  );
};
