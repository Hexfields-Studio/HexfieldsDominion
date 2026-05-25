import { Group, RegularPolygon, Text, Image } from "react-konva";
import { useEffect, useState } from "react";
import { resourcesFields } from "@/repository/MatchRepository";

export interface hexagonProps {
    q: number,
    r: number,
    x: number,
    y: number,
    fill: string,
    radius: number,
    label: string,
    resource?: typeof resourcesFields[number]
}

export const Hexagon: React.FC<hexagonProps> = ({ x, y, fill, radius, label, resource }) => {
  const [textureImage, setTextureImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (resource) {
      // Randomly pick between variant 1 and 2
      const variant = Math.random() > 0.5 ? "1" : "2";
      const imgPath = `${import.meta.env.BASE_URL}fields/${resource.toLowerCase()}Field${variant}.png`;
      
      const img = new window.Image();
      img.src = imgPath;
      img.onload = () => setTextureImage(img);
    }
  }, [resource]);

  // 8-direction offsets for number aura
  const shadowOffsets = [
    [-2, -2], [-2, 0], [-2, 2],
    [0, -2],           [0, 2],
    [2, -2],  [2, 0],  [2, 2]
  ];

  return (
    <Group x={x} y={y}>
      {textureImage && (
        <Group
          clipFunc={(ctx) => {
            const startAngle = -Math.PI / 2; // Start at -90° to match hexagon orientation
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = startAngle + (Math.PI / 3) * i;
              const px = radius * Math.cos(angle);
              const py = radius * Math.sin(angle);
              if (i === 0) {
                ctx.moveTo(px, py);
              } else {
                ctx.lineTo(px, py);
              }
            }
            ctx.closePath();
          }}
        >
          <Image
            image={textureImage}
            x={-radius}
            y={-radius}
            width={radius * 2}
            height={radius * 2}
          />
        </Group>
      )}
      
      <RegularPolygon
        x={0}
        y={0}
        sides={6}
        radius={radius}
        fill={textureImage ? "transparent" : fill}
        stroke="black"
        strokeWidth={4}
      />

      {shadowOffsets.map(([dx, dy], i) => (
        <Text
          key={`shadow-${i}`}
          x={dx}
          y={dy}
          text={label}
          fontSize={30}
          fontStyle="bold"
          fill="#ffffff"
          align="center"
          offsetX={15}
          offsetY={15}
        />
      ))}

      <Text
        x={0}
        y={0}
        text={label}
        fontSize={30}
        fontStyle="bold"
        align="center"
        offsetX={15}
        offsetY={15}
      />
            
    </Group>
  );
};