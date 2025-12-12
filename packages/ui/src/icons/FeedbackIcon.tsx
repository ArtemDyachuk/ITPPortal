import React from 'react';

interface FeedbackIconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const FeedbackIcon: React.FC<FeedbackIconProps> = ({
  className,
  size = 18,
  color = 'currentColor',
  strokeWidth = 0,
}) => (
    <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
      style={{ color }}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM4 18.385L5.763 17H20V5H4v13.385zM11 13h2v2h-2v-2zm0-6h2v5h-2V7z"
          {...(strokeWidth > 0 ? { stroke: color, strokeWidth } : {})}
        ></path>
      </g>
    </g>
  </svg>
);

export default FeedbackIcon;
