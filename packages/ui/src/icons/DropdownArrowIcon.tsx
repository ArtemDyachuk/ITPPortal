import React from 'react';

interface DropdownArrowIconProps {
  className?: string;
  size?: number;
  color?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  strokeWidth?: number;
}

const DropdownArrowIcon: React.FC<DropdownArrowIconProps> = ({
  className,
  size = 16,
  color = 'currentColor',
  direction = 'down',
  strokeWidth = 2,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
    style={{ transform: (() => {
      switch (direction) {
        case 'up': return 'rotate(180deg)';
        case 'left': return 'rotate(-90deg)';
        case 'right': return 'rotate(90deg)';
        default: return 'rotate(0deg)';
      }
    })() }}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M6.29289 9.70711L11.2929 14.7071C11.6834 15.0976 12.3166 15.0976 12.7071 14.7071L17.7071 9.70711"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  </svg>
);

export default DropdownArrowIcon;
