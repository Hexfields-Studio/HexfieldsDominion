import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage } from "react-konva";
import "./game_field.scss";
import type Konva from "konva";
import { Hexagon, type hexagonProps } from "./hexagon";
import { StructureComp, type StructureCompProps } from "./structure";
import GameGui from "./gameGui/GameGui";
import { Background } from "./background";
import { useSseListeners } from "@/hooks/sseHooks/useSseListeners";
import { useAuth, useGame, useMatchRepository } from "@/contexts/contexts";
import { useFields } from "@/hooks/matchHooks/useFields";
import type { Field, MatchData, Structure, StructureType } from "@/repository/MatchRepository";
import { useStructures } from "@/hooks/matchHooks/useStructures";

const radius: number = 100;

type Corner = { key: string, disabled: boolean, direction: number; x: number; y: number; adjacentHexes: { q: number; r: number }[] };
type CornerOffset = { direction: number; dx: number; dy: number };
const cornerOffsetToAdjacentHexDeltas = [
  [{ q: 0, r: -1 }, { q: 1, r: -1 }],
  [{ q: 1, r: -1 }, { q: 1, r: 0 }],
  [{ q: 1, r: 0 }, { q: 0, r: 1 }],
  [{ q: 0, r: 1 }, { q: -1, r: 1 }],
  [{ q: -1, r: 1 }, { q: -1, r: 0 }],
  [{ q: -1, r: 0 }, { q: 0, r: -1 }],
];
const cornerOffsets: CornerOffset[] = [];
for (let i = 0; i < 6; i++) {   // Precompute the 6 unit corner offsets for this radius
  // Start at top (-90°), move clockwise by adding 60° each step
  const angle = (Math.PI / 180) * (-90 + 60 * i);
  cornerOffsets.push({
    direction: i,
    dx: radius * Math.cos(angle),
    dy: radius * Math.sin(angle),
  });
}

type Edge = {key: string, direction: number; x: number, y: number; width: number; height: number; adjacentHexes: { q: number; r: number }[]};
const edgeDirectionToAdjacentHexDelta = [
  { q: 1, r: -1 },
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
];
const edgeDirectionInDegrees: number[] = [30, 90, -30];

const MIN_SCALE = 0.75;
const MAX_SCALE = 2;
const SCALE_BY = 1.1;

function computeUniqueEdges(hexagons: hexagonProps[]): Map<string, Edge> {
  const edgeMap = new Map<string, Edge>();
    
  for (const hex of hexagons) {
    for (let direction = 0; direction < 6; direction++) {
      const { x, y, q, r } = hex;
      const start = { x: x + cornerOffsets[direction].dx, y: y + cornerOffsets[direction].dy };
      const end = { x: x + cornerOffsets[(direction+1) % 6].dx, y: y + cornerOffsets[(direction+1) % 6].dy };
      const adjacentHexes = [{ q, r }, { q: q + edgeDirectionToAdjacentHexDelta[direction].q, r: r + edgeDirectionToAdjacentHexDelta[direction].r }];
      const mapKey = adjacentHexes.map(h => `${h.q},${h.r}`).sort().join("|");
            
      if (!edgeMap.has(mapKey)) edgeMap.set(mapKey,{
        key: mapKey,
        direction: direction % 3,
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
        width: radius,
        height: radius / 3,
        adjacentHexes: adjacentHexes,
      });
    }
  }
    
  return edgeMap;
}

function computeUniqueCorners(hexagons: hexagonProps[]): Map<string, Corner> {
  const cornerMap = new Map<string, Corner>();

  for (const hex of hexagons) {
    const { x, y, q, r } = hex;

    for (const c of cornerOffsets) {
      const corner_x = x + c.dx;
      const corner_y = y + c.dy;
      const adjacentHexes = [{ q, r }, ...cornerOffsetToAdjacentHexDeltas[c.direction].map(delta => ({ q: q + delta.q, r: r + delta.r }))];
      const mapKey = adjacentHexes.map(h => `${h.q},${h.r}`).sort().join("|");
      if (!cornerMap.has(mapKey)) {
        const corner: Corner = {
          key: mapKey,
          disabled: false,
          direction: c.direction,
          x: corner_x,
          y: corner_y,
          adjacentHexes: adjacentHexes
        }
        cornerMap.set(mapKey, corner);
      }
    }
  }

  return cornerMap;
}

interface GameFieldProps {
    boardRadius: number
}

const GameField: React.FC<GameFieldProps> = () => {
  const {fetchWithAuth} = useAuth();
  const { uuid } = useGame();

  // subscriptions
  const { repository } = useMatchRepository();
  const fields: Field[] = useFields();
  const structures: Structure[] = useStructures();

  const [hexagons, setHexagons] = useState<hexagonProps[]>([]);
  const [cornerMap, setCornerMap] = useState<Map<string, Corner>>(new Map<string, Corner>());
  const [corners, setCorners] = useState<Corner[]>([]);
  const [disabledCorners, setDisabledCorners] = useState<Set<string>>(new Set());
  const [edgeMap, setEdgeMap] = useState<Map<string, Edge>>(new Map<string, Edge>());
  const [edges, setEdges] = useState<Edge[]>([]);
  const [disabledEdges, setDisabledEdges] = useState<Set<string>>(new Set());

  const [structureComps, setStructureComps] = useState<StructureCompProps[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  //For Camera Dragging
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const cameraOffsetRef = useRef(cameraOffset);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x_mouse: 0, y_mouse: 0 });
  const [containerClientSize, setContainerClientSize] = useState({ width: 0, height: 0 });

  //For Mousewheel zoom
  const [scale, setScale] = useState(1);

  // For animated background
  const [backgroundOffsetX, setBackgroundOffsetX] = useState(0);
  const backgroundDirectionRef = useRef(Math.random() > 0.5 ? 1 : -1); // 1 for east, -1 for west
  const backgroundSpeedRef = useRef(0.5); // animation speed inpixels per frame

  useSseListeners(useMemo(() => [
    {
      type: "matchData",
      action: (event: MessageEvent) => {
        const matchData: MatchData = JSON.parse(event.data);
        repository.setMatchData(matchData);
      },
    },
  ], [repository]));

  useEffect(()=>{
    if(structures.length === 0) return;
    const newCorners: Corner[] = [];
    const newEdges: Edge[] = [];
    structures.forEach(structure => {
      const corner: Corner | undefined = cornerMap.get(structure.pos.map(h => `${h.q},${h.r}`).sort().join("|"));
      const edge: Edge | undefined = edgeMap.get(structure.pos.map(h => `${h.q},${h.r}`).sort().join("|"));
      if (corner) {
        corner.disabled = true;
        newCorners.push(corner);
      }
      if (edge){
        newEdges.push(edge);
      }
    });
    setDisabledCorners(new Set([...disabledCorners, ...newCorners.map(corner => 
      corner.adjacentHexes.map(h => `${h.q},${h.r}`).sort().join("|")
    )]));
    setDisabledEdges(new Set([...disabledEdges, ...newEdges.map(edge => 
      edge.adjacentHexes.map(h => `${h.q},${h.r}`).sort().join("|")
    )]));

    setStructureComps([
        ...newEdges.map(edge => {
          let rotation: number = edgeDirectionInDegrees[edge.direction]
          let src: string = "../structures/bridgeHorizontal.png";
          if(rotation === 90){
            src = "../structures/bridgeVertical.png";
          }
          return {
                type: "STREET" as StructureType,
                x: edge.x,
                y: edge.y,
                rotation: rotation,
                src: src,
                width: edge.width,
                height: edge.height,
              }
        }),
        ...newCorners.map(corner => {
            return {
                type: "SETTLEMENT" as StructureType,
                x: corner.x,
                y: corner.y,
                rotation: 0,
                src: "../structures/house_small.png",
                width: 120,
                height: 120,
                scale: 0.5,
              }
          }),
      ]);
  }, [structures])

  useEffect(() => {
    cameraOffsetRef.current = cameraOffset;
  }, [cameraOffset]);

  const handleResize = (container: HTMLDivElement | null) => {
    if (container) {
      setDimensions({ width: container.offsetWidth, height: container.offsetHeight });

      const clientWidth: number = container.clientWidth;
      const clientHeight: number = container.clientHeight;
      setContainerClientSize({ width: clientWidth, height: clientHeight });

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
        height: container.clientHeight,
      });
      setDimensions({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    }

    window.addEventListener("resize", ()=>handleResize(container));
    
    // Animation loop for background
    let animationFrameId: number;
    const animate = () => {
      setBackgroundOffsetX(prev => {
        const newOffset = prev + backgroundSpeedRef.current * backgroundDirectionRef.current;
        return newOffset % 1000000; // prevent overflow of offset number with modulo
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("resize", ()=>handleResize(container));
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const generateHexagons = useCallback((newHexagons: hexagonProps[]) => {
    fields.forEach(field => {
      const q = field.pos.q;
      const r = field.pos.r;
      const x = (q + r/2) * Math.sqrt(3) * radius;
      const y = r * (3/2) * radius;
      newHexagons.push({ q, r, x, y, fill: "green", radius: radius, label: field.numberChip !== 0 ? field.numberChip.toString() : "", resource: field.resource });
    });
  }, [fields]);

  useEffect(()=>{
    if(fields.length === 0) return;
    const newHexagons: hexagonProps[] = [];
    generateHexagons(newHexagons);

    const newCornerMap = computeUniqueCorners(newHexagons);
    setCornerMap(newCornerMap);
    setCorners([...newCornerMap.values()]);

    const newEdgeMap = computeUniqueEdges(newHexagons);
    setEdgeMap(newEdgeMap);
    setEdges([...newEdgeMap.values()]);
    setHexagons(newHexagons);
  }, [fields, generateHexagons]);

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
      y: Math.max(-halfHeight, Math.min(pointer.y - stage.height() / 2 - mousePointTo.y * newScale, halfHeight)),
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
                
        onTouchEnd={()=>setIsDragging(false)}
        onMouseUp={()=>setIsDragging(false)}
        onMouseLeave={()=>setIsDragging(false)}
      >
        <Layer
          x={cameraOffset.x + dimensions.width / 2}
          y={cameraOffset.y + dimensions.height / 2}
          scaleX={scale}
          scaleY={scale}
          imageSmoothingEnabled={false}
        >
          <Background imagePath="fields/waterSeamless.png" gridSize={6} scale={0.5} offsetX={backgroundOffsetX} />
          {hexagons.map((hex, i) => (
            <Hexagon key={`hex-${i}`} q={hex.q} r={hex.r} x={hex.x} y={hex.y} fill={hex.fill} radius={radius} label={hex.label} resource={hex.resource}/>
          ))}

          {edges.map((edge, i) => {
            const isDisabled: boolean = disabledEdges.has(edge.key);
            return (
              <Rect key={`edge-${i}`} x={edge.x} y={edge.y} width={edge.width} height={edge.height} offset={{ x: edge.width/2, y: edge.height/2 }} fill={"gold"} opacity={isDisabled ? 0.0 : 0.3} rotation={edgeDirectionInDegrees[edge.direction]}
              onClick={()=>{
                if (isDisabled) return;
                const sendBuildRequest = async () => {
                    const pos: {q: number, r: number}[] = [];
                    for (let adjacentHex of edge.adjacentHexes){
                      pos.push(adjacentHex);
                    }
                    await fetchWithAuth(`/games/${uuid}/makeMove`, "POST", JSON.stringify({
                      type: "BUILD",
                      structureType: "STREET",
                      pos: pos
                    }));
                  }
                  sendBuildRequest();
              }}/>
            )
          })}

          {structureComps.map((structure, i) => (
            <StructureComp type={structure.type} key={`structure-${i}`} x={structure.x} y={structure.y} rotation={structure.rotation} src={structure.src} width={structure.width} height={structure.height} scale={structure.scale}/>
          ))}

          {corners.map(corner => {
            const isDisabled: boolean = disabledCorners.has(corner.key);
            return (
              <Circle key={corner.key} x={corner.x} y={corner.y} radius={20} opacity={isDisabled ? 0.0 : 1}
                fillLinearGradientStartPoint={{ x: -20, y: -20 }}
                fillLinearGradientEndPoint={{ x: 20, y: 20 }}
                fillLinearGradientColorStops={[0, "turquoise", 1, "blue"]}
                onClick={()=>{
                  //if (isDisabled) return;
                  const sendBuildRequest = async () => {
                    const pos: {q: number, r: number}[] = [];
                    for (let adjacentHex of corner.adjacentHexes){
                      pos.push(adjacentHex);
                    }
                    await fetchWithAuth(`/games/${uuid}/makeMove`, "POST", JSON.stringify({
                      type: "BUILD",
                      structureType: !isDisabled ? "SETTLEMENT" : "TOWN",
                      pos: pos
                    }));
                  }
                  sendBuildRequest();
                }}/>
            );
          })}
        </Layer>
        <GameGui/>
      </Stage>
    </div>
  );
};

export default GameField;