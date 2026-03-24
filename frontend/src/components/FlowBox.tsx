interface FlowBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  dashed?: boolean;
  fontSize?: number;
  id?: string;
  isHighlighted?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  description?: string;
}

export function FlowBox({ 
  x, 
  y, 
  width, 
  height, 
  label, 
  dashed = false, 
  fontSize = 14,
  id,
  isHighlighted = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  description
}: FlowBoxProps) {
  return (
    <g 
      id={id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className="transition-all duration-200"
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isHighlighted ? "#dbeafe" : "white"}
        stroke={isHighlighted ? "#3b82f6" : "black"}
        strokeWidth={isHighlighted ? 3 : (dashed ? 1.5 : 2)}
        strokeDasharray={dashed ? "5,5" : "0"}
        className="transition-all duration-200"
      />
      <foreignObject x={x} y={y} width={width} height={height}>
        <div className="flex items-center justify-center h-full px-2 text-center pointer-events-none" style={{ fontSize: `${fontSize}px` }}>
          {label}
        </div>
      </foreignObject>
      {description && isHighlighted && (
        <title>{description}</title>
      )}
    </g>
  );
}
