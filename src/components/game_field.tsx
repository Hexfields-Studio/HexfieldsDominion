import { useEffect, useRef, useState } from "react";
import { Layer, RegularPolygon, Stage } from "react-konva";
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

const radius: number = 100;

function generateHexagons(newHexagons: hexagon[], boardRadius: number) {
    console.log("Generating")
    for (let q = -boardRadius + 1; q <= boardRadius - 1; q++) {
        const r1 = Math.max(-boardRadius + 1, -q - boardRadius + 1);
        const r2 = Math.min(boardRadius - 1, -q + boardRadius - 1);
        for (let r = r1; r <= r2; r++) {
            const x = (q + r/2) * Math.sqrt(3) * radius;
            const y = r * (3/2) * radius;
            newHexagons.push({x, y, fill: "gold"});
        }
    }
}

const GameField: React.FC<GameFieldProps> = ({boardRadius}) => {
    const [hexagons, setHexagons] = useState<hexagon[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    //For Camera Dragging
    const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
    const cameraOffsetRef = useRef(cameraOffset);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x_mouse: 0, y_mouse: 0 });
    const [containerClientSize, setContainerClientSize] = useState({width: 0, height: 0});

    useEffect(() => {
        cameraOffsetRef.current = cameraOffset;
    }, [cameraOffset]);

    const handleResize = (container: HTMLDivElement | null) => {
        if (container) {
            setDimensions({width: container.offsetWidth, height: container.offsetHeight});

            const clientWidth: number = container.clientWidth;
            const clientHeight: number = container.clientHeight;
            setContainerClientSize({width: clientWidth, height: clientHeight});

            const halfWidth = clientWidth / 2;
            const halfHeight = clientHeight / 2;
            setCameraOffset({
                x: Math.max(-halfWidth, Math.min(cameraOffsetRef.current.x, halfWidth)),
                y: Math.max(-halfHeight, Math.min(cameraOffsetRef.current.y, halfHeight)),
            });
        }
    };

    useEffect(() => {
        const container: HTMLDivElement | null = containerRef.current;
        if (container) {
            setContainerClientSize({width: container.clientWidth, height: container.clientHeight});
            setDimensions({
                width: container.offsetWidth,
                height: container.offsetHeight,
            });
        }

        const newHexagons: hexagon[] = []
        generateHexagons(newHexagons, boardRadius)
        setHexagons(newHexagons);

        window.addEventListener("resize", ()=>handleResize(container));
        return () => window.removeEventListener("resize", ()=>handleResize(container));
    }, []);

    function moveCamera({x_mouse, y_mouse}: {x_mouse: number, y_mouse: number}) {
        const halfWidth = containerClientSize.width / 2;
        const halfHeight = containerClientSize.height / 2;

        let newCameraOffsetX: number = x_mouse - dragStart.x_mouse;
        newCameraOffsetX = Math.max(-halfWidth, Math.min(newCameraOffsetX, halfWidth));
        let newCameraOffsetY: number =  y_mouse - dragStart.y_mouse;
        newCameraOffsetY = Math.max(-halfHeight, Math.min(newCameraOffsetY, halfHeight));
        setCameraOffset({
            x: newCameraOffsetX,
            y: newCameraOffsetY,
        });
    }

    return (
        <div ref={containerRef} className="full-page-container">
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    setIsDragging(true);
                    setDragStart({
                        x_mouse: e.evt.clientX - cameraOffset.x,
                        y_mouse: e.evt.clientY - cameraOffset.y,
                    });
                }}
                onMouseMove={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (!isDragging) return;
                    moveCamera({x_mouse: e.evt.clientX, y_mouse: e.evt.clientY});
                }}
                onMouseUp={()=>setIsDragging(false)}
                onMouseLeave={()=>setIsDragging(false)}
            >
                <Layer x={cameraOffset.x + dimensions.width / 2} y={cameraOffset.y + dimensions.height / 2}>
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