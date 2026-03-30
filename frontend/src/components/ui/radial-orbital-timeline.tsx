"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "./badge";
import { MetalButton } from "./liquid-glass-button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { useNavigate } from "react-router-dom";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  path: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
           newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 220; // Expanded orbit radius slightly 
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed": return "text-white bg-primary-600 border-primary-400";
      case "in-progress": return "text-gray-900 bg-white border-primary-400";
      case "pending": return "text-white bg-gray-800 border-white/50";
      default: return "text-white bg-gray-800 border-white/50";
    }
  };

  return (
    <div
      className="w-full h-[600px] flex flex-col items-center justify-center bg-gray-900/5 rounded-3xl overflow-hidden shadow-inner border border-white/40 backdrop-blur-md"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Central Hub Core - Using the app's primary theme colors */}
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 via-primary-500 to-primary-600 animate-pulse flex items-center justify-center z-10 shadow-2xl shadow-primary-500/50">
            <div className="absolute w-28 h-28 rounded-full border-2 border-primary-500/30 animate-ping opacity-70"></div>
            <div className="absolute w-36 h-36 rounded-full border border-primary-500/20 animate-ping opacity-50" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-inner flex items-center justify-center">
               <span className="w-4 h-4 rounded-full bg-primary-500 animate-pulse"></span>
            </div>
          </div>

          <div className="absolute w-[440px] h-[440px] rounded-full border border-gray-400/20 shadow-orbital bg-white/5 backdrop-blur-sm"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: `radial-gradient(circle, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  w-14 h-14 rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-primary-600 text-white shadow-xl shadow-primary-500/40"
                      : isRelated
                      ? "bg-white/80 text-primary-600"
                      : "bg-white/60 text-gray-700 backdrop-blur-md"
                  }
                  border-4 
                  ${
                    isExpanded
                      ? "border-white"
                      : isRelated
                      ? "border-primary-400 animate-pulse"
                      : "border-white/60"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-125" : "hover:scale-110"}
                `}
                >
                  <Icon size={24} className={isExpanded ? 'animate-pulse' : ''} />
                </div>

                <div
                  className={`
                  absolute top-16 whitespace-nowrap left-1/2 -translate-x-1/2
                  text-sm font-black tracking-wider bg-white/80 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm border border-gray-200/50
                  transition-all duration-300
                  ${isExpanded ? "text-primary-600 scale-110 w-max" : "text-gray-600"}
                `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-28 left-1/2 -translate-x-1/2 w-80 bg-white/95 backdrop-blur-2xl border-white shadow-2xl overflow-visible z-50 p-4 rounded-3xl">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-gradient-to-b from-primary-500 to-transparent"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-[10px] uppercase font-black tracking-widest ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "ONLINE" : item.status === "in-progress" ? "ACTIVE" : "PENDING"}
                        </Badge>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</span>
                      </div>
                      <CardTitle className="text-xl font-black text-gray-900 mt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm font-medium text-gray-600 pb-2">
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="flex items-center font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                            <Zap size={12} className="mr-1 text-yellow-500" /> System Load
                          </span>
                          <span className="font-black text-primary-600">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-400 to-primary-600" style={{ width: `${item.energy}%` }}></div>
                        </div>
                      </div>
                      
                      {/* Deep Link Navigation Action */}
                      <div className="mt-6 flex justify-center w-full">
                         <MetalButton 
                           variant="primary" 
                           onClick={(e) => { e.stopPropagation(); navigate(item.path); }} 
                           className="w-full text-[15px] !h-14 tracking-wider uppercase"
                         >
                           <span className="flex items-center">Access <ArrowRight className="w-5 h-5 ml-2 animate-pulse" /></span>
                         </MetalButton>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center mb-2">
                            <Link size={12} className="text-gray-400 mr-1" />
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-gray-500">Connected Hubs</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <button
                                  key={relatedId}
                                  className="flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={10} className="ml-1 text-gray-400" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
