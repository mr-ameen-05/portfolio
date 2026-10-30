import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';

export interface Icon3DProps {
  icon?: React.ElementType | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glowColor?: string;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
  shape?: 'squircle' | 'circle' | 'hexagon';
}

const sizeClasses = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-2xl',
  xl: 'w-14 h-14 rounded-2xl',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};

export default function Icon3D({
  icon: IconComponent,
  size = 'md',
  glowColor = '#C8FF00',
  className = '',
  iconClassName = '',
  children,
  shape = 'squircle',
}: Icon3DProps) {
  const containerSizeClass = sizeClasses[size];
  const defaultIconSize = iconSizes[size];

  const shapeClass = shape === 'circle' ? '!rounded-full' : '';

  return (
    <div
      className={`icon-3d ${containerSizeClass} ${shapeClass} ${className}`}
      style={
        {
          '--glow-color': glowColor,
        } as React.CSSProperties
      }
    >
      <div className={`icon-3d-glyph flex items-center justify-center ${iconClassName}`}>
        {children ? (
          children
        ) : typeof IconComponent === 'string' ? (
          <IconifyIcon icon={IconComponent} className={iconClassName || defaultIconSize} />
        ) : IconComponent ? (
          <IconComponent className={iconClassName || defaultIconSize} />
        ) : null}
      </div>
    </div>
  );
}
