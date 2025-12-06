import { Group, RegularPolygon, Text } from "react-konva";

export interface hexagonProps {
    q: number,
    r: number,
    x: number,
    y: number,
    fill: string,
    radius: number,
    label: string
}

export const Hexagon: React.FC<hexagonProps> = ({x, y, fill, radius, label}) => {

    return (
        <Group x={x} y={y}>
            <RegularPolygon
                x={0}
                y={0}
                sides={6} // Hexagon has 6 sides
                radius={radius}
                fill={fill}
                stroke="black"
                strokeWidth={2}
            />

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
}