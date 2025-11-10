import { useEffect, useRef, useState } from "react";
import { Layer, Rect, RegularPolygon, Stage } from "react-konva";
import "./game_field.css";
import type Konva from "konva";

interface hexagon{
    x: number,
    y: number,
    fill: string
}

interface GameFieldProps {
    boardRadius: number
}

const GameField: React.FC<GameFieldProps> = ({boardRadius}) => {
    const hexagons: hexagon[] = [];
    const [radius, setRadius] = useState(100);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    //For Camera Dragging
    const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x_change: 0, y_change: 0 });
    const [containerClientSize, setContainerClientSize] = useState({width: 0, height: 0});

    for (let q = -boardRadius + 1; q <= boardRadius - 1; q++) {
        const r1 = Math.max(-boardRadius + 1, -q - boardRadius + 1);
        const r2 = Math.min(boardRadius - 1, -q + boardRadius - 1);
        for (let r = r1; r <= r2; r++) {
            const x = (q + r/2) * Math.sqrt(3) * radius + window.innerWidth/2;
            const y = r * (3/2) * radius + window.innerHeight/2;
            hexagons.push({x, y, fill: "lightblue"});
        }
    }

    useEffect(() => {
        const container: HTMLDivElement | null = containerRef.current;
        if (container) {
            setContainerClientSize({width: container.clientWidth, height: container.clientHeight});
            setDimensions({
                width: container.offsetWidth,
                height: container.offsetHeight,
            });
        }

        const handleResize = () => {
            if (container) {
                setDimensions({width: container.offsetWidth, height: container.offsetHeight});
                setContainerClientSize({width: container.clientWidth, height: container.clientHeight});
                moveCamera(dragStart);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log(cameraOffset, containerRef.current?.clientWidth, containerRef.current?.clientHeight);
        setIsDragging(true);
        setDragStart({
            x_change: e.evt.clientX - cameraOffset.x,
            y_change: e.evt.clientY - cameraOffset.y,
        });
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isDragging) return;
        moveCamera({x_change: e.evt.clientX, y_change: e.evt.clientY});
    };

    function moveCamera({x_change, y_change}: {x_change: number, y_change: number}) {
        const halfWidth = containerClientSize.width / 2;
        const halfHeight = containerClientSize.height / 2;

        let x: number = x_change - dragStart.x_change;
        x = Math.max(-halfWidth, Math.min(x, halfWidth));
        let y: number =  y_change - dragStart.y_change;
        y = Math.max(-halfHeight, Math.min(y, halfHeight));
        setCameraOffset({
            x: x,
            y: y,
        });
    }


    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div ref={containerRef} className="full-page-container">
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <Layer x={cameraOffset.x} y={cameraOffset.y}>
                    {hexagons.map((hex, i) => (
                    <RegularPolygon
                        key={i}
                        x={hex.x}
                        y={hex.y}
                        sides={6} // Hexagon has 6 sides
                        radius={radius}
                        fill={hex.fill}
                        stroke="black"
                        strokeWidth={2}
                    />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default GameField;