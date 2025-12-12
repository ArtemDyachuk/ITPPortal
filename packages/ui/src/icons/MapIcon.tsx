import React from 'react';

interface MapIconProps {
  className?: string;
  size?: number;
  color?: string;
  innerFill?: string;
}

const MapIcon: React.FC<MapIconProps> = ({
  className,
  size = 18,
  color = 'currentColor',
  innerFill = '#ffffff',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      <path
        d="M12 6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
        fill={innerFill}
        opacity="0.9"
      />
    </g>
  </svg>
);

export default MapIcon;
