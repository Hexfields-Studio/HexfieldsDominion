import { useEffect, useState } from "react";
import { Image } from "react-konva";

interface BackgroundProps {
  imagePath: string;
  tileSize?: number;
  gridSize?: number;
}

export const Background: React.FC<BackgroundProps> = ({ imagePath, tileSize = 256, gridSize = 8 }) => {
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = imagePath;
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
            x={(col - gridSize / 2) * tileSize}
            y={(row - gridSize / 2) * tileSize}
            width={tileSize}
            height={tileSize}
          />
        ))
      )}
    </>
  );
};
