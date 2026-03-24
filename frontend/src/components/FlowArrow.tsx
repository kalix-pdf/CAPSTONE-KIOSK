interface Point {
  x: number;
  y: number;
}

interface FlowArrowProps {
  points: Point[];
  label?: string;
  labelPosition?: Point;
  dashed?: boolean;
  id?: string;
  isHighlighted?: boolean;
  isAnimated?: boolean;
}

export function FlowArrow({ 
  points, 
  label, 
  labelPosition, 
  dashed = false,
  id,
  isHighlighted = false,
  isAnimated = false
}: FlowArrowProps) {
  if (points.length < 2) return null;

  // Create path string
  let pathString = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathString += ` L ${points[i].x} ${points[i].y}`;
  }

  // Calculate path length for animation
  const pathLength = points.reduce((acc, point, i) => {
    if (i === 0) return 0;
    const prev = points[i - 1];
    return acc + Math.sqrt(Math.pow(point.x - prev.x, 2) + Math.pow(point.y - prev.y, 2));
  }, 0);

  // Calculate arrowhead position and angle
  const lastPoint = points[points.length - 1];
  const secondLastPoint = points[points.length - 2];
  const angle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x);

  return (
    <g id={id}>
      <path
        d={pathString}
        fill="none"
        stroke={isHighlighted ? "#3b82f6" : "black"}
        strokeWidth={isHighlighted ? 2.5 : 1.5}
        strokeDasharray={dashed ? "5,5" : "0"}
        className="transition-all duration-200"
      />
      
      {/* Animated dot for data flow */}
      {isAnimated && (
        <>
          <circle r="4" fill="#3b82f6">
            <animateMotion dur="2s" repeatCount="indefinite" path={pathString} />
          </circle>
        </>
      )}
      
      {/* Arrowhead */}
      <polygon
        points={`0,-4 8,0 0,4`}
        fill={isHighlighted ? "#3b82f6" : "black"}
        transform={`translate(${lastPoint.x}, ${lastPoint.y}) rotate(${(angle * 180) / Math.PI})`}
        className="transition-all duration-200"
      />
      {label && labelPosition && (
        <text 
          x={labelPosition.x} 
          y={labelPosition.y} 
          fontSize="12" 
          textAnchor="middle"
          fill={isHighlighted ? "#3b82f6" : "black"}
          className="transition-all duration-200"
        >
          {label}
        </text>
      )}
    </g>
  );
}
