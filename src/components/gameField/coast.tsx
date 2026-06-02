import { useEffect, useState } from "react";
import { Group, Image } from "react-konva"

interface CoastProps {
    coastRadius: number;
}

export const Coast: React.FC<CoastProps> = ({coastRadius}) => {
    const [textureImage, setTextureImage] = useState<HTMLImageElement | null>(null);

    useEffect(()=>{
        const imgPath = `${import.meta.env.BASE_URL}fields/coast.png`;
      
        const img = new window.Image();
        img.src = imgPath;
        img.onload = () => setTextureImage(img);
    });

    return (
        <>
            {textureImage && (
                <Group
                    x={0}
                    y={0}
                    clipFunc={(ctx) => {
                        ctx.beginPath();
                        ctx.arc(0, 0, coastRadius, 0, Math.PI * 2);
                        ctx.closePath();
                    }}
                >
                    <Image
                        image={textureImage}
                        x={-coastRadius}
                        y={-coastRadius}
                        width={coastRadius * 2}
                        height={coastRadius * 2}
                    />
                </Group>
            )}
        </>
    )
}