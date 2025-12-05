import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import "./game_field.css";
import type Konva from "konva";
import { Hexagon, type hexagonProps } from "./hexagon";

const radius: number = 100;

const MIN_SCALE = 0.75;
const MAX_SCALE = 2;
const SCALE_BY = 1.1;

const numberChips: number[] = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12];
numberChips.sort(() => Math.random() - 0.5); // Shuffle

interface GameFieldProps {
    boardRadius: number
}

function generateHexagons(newHexagons: hexagonProps[], boardRadius: number) {
    for (let q = -boardRadius + 1; q <= boardRadius - 1; q++) {
        const r1 = Math.max(-boardRadius + 1, -q - boardRadius + 1);
        const r2 = Math.min(boardRadius - 1, -q + boardRadius - 1);
        for (let r = r1; r <= r2; r++) {
            const x = (q + r/2) * Math.sqrt(3) * radius;
            const y = r * (3/2) * radius;
            if (q === 0 && r === 0) { // center hex  
                newHexagons.push({x, y, fill: "gold", radius: radius, label: ""});
            }else{  
                newHexagons.push({x, y, fill: "green", radius: radius, label: numberChips.pop()!.toString()});
            }
        }
    }
}

const GameField: React.FC<GameFieldProps> = ({boardRadius}) => {

    const [hexagons, setHexagons] = useState<hexagonProps[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    //For Camera Dragging
    const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
    const cameraOffsetRef = useRef(cameraOffset);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x_mouse: 0, y_mouse: 0 });
    const [containerClientSize, setContainerClientSize] = useState({width: 0, height: 0});

    //For Mousewheel zoom
    const [scale, setScale] = useState(1);

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
            setContainerClientSize({
                width: container.clientWidth,
                height: container.clientHeight
            });
            setDimensions({
                width: container.offsetWidth,
                height: container.offsetHeight,
            });
        }

        const newHexagons: hexagonProps[] = []
        generateHexagons(newHexagons, boardRadius)
        setHexagons(newHexagons);

        window.addEventListener("resize", ()=>handleResize(container));
        return () => window.removeEventListener("resize", ()=>handleResize(container));
    }, []);

    function moveCamera(e: Konva.KonvaEventObject<MouseEvent>) {
        const halfWidth = containerClientSize.width / 2;
        const halfHeight = containerClientSize.height / 2;

        let newCameraOffsetX: number = e.evt.clientX - dragStart.x_mouse;
        newCameraOffsetX = Math.max(-halfWidth, Math.min(newCameraOffsetX, halfWidth));
        let newCameraOffsetY: number =  e.evt.clientY - dragStart.y_mouse;
        newCameraOffsetY = Math.max(-halfHeight, Math.min(newCameraOffsetY, halfHeight));
        setCameraOffset({
            x: newCameraOffsetX,
            y: newCameraOffsetY,
        });
    }

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        
        e.evt.preventDefault(); // Prevents standard scrooling in browsers
        const stage = e.target.getStage();
        if (!stage) return;

        const oldScale = scale;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        // Cursor position relative to the stage center
        const mousePointTo = {
            x: (pointer.x - stage.width() / 2 - cameraOffset.x) / oldScale,
            y: (pointer.y - stage.height() / 2 - cameraOffset.y) / oldScale,
        };

        // Zoom direction
        const direction = e.evt.deltaY > 0 ? 1 : -1;
        const newScale = Math.max(MIN_SCALE, Math.min(oldScale * (direction > 0 ? 1 / SCALE_BY : SCALE_BY), MAX_SCALE));
        setScale(newScale);

        // Compute new camera offset so zoom centers on cursor
        const halfWidth = containerClientSize.width / 2;
        const halfHeight = containerClientSize.height / 2;
        
        const newCameraOffset = {
            x: Math.max(-halfWidth, Math.min(pointer.x - stage.width() / 2 - mousePointTo.x * newScale, halfWidth)),
            y: Math.max(-halfHeight, Math.min(pointer.y - stage.height() / 2 - mousePointTo.y * newScale, halfHeight))
        };

        setCameraOffset(newCameraOffset);

        // If the user is currently dragging the camera, update dragStart so
        // subsequent mouse moves remain relative to the new camera offset.
        // This prevents the view from jumping when zooming while dragging.
        if (isDragging) {
            // e.evt.clientX / clientY are in viewport pixels, same units used when
            // dragStart was set during onMouseDown (clientX - cameraOffset.x).
            setDragStart({
                x_mouse: (e.evt as WheelEvent).clientX - newCameraOffset.x,
                y_mouse: (e.evt as WheelEvent).clientY - newCameraOffset.y,
            });

            // Keep the ref in sync for immediate calculations elsewhere.
            cameraOffsetRef.current = newCameraOffset;
        }
    };

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
                    moveCamera(e);
                }}
                onWheel={handleWheel}
                onMouseUp={()=>setIsDragging(false)}
                onMouseLeave={()=>setIsDragging(false)}
            >
                <Layer
                x={cameraOffset.x + dimensions.width / 2}
                y={cameraOffset.y + dimensions.height / 2}
                scaleX={scale}
                scaleY={scale}
                
                >
                    {hexagons.map((hex, i) => (
                            <Hexagon key={i} x={hex.x} y={hex.y} fill={hex.fill} radius={radius} label={hex.label}/>
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default GameField;