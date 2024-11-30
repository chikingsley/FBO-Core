import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const panelVariants = cva(
  "fixed rounded-lg shadow-lg backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "bg-black/80 text-white",
        stats: "bg-transparent",
        minimal: "bg-white/10"
      },
      size: {
        default: "min-w-[200px]",
        large: "min-w-[300px]",
        full: "w-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Panel = forwardRef(({ 
  children,
  className,
  title,
  variant,
  size,
  position = { top: '20px', right: '20px' },
  style = {},
  ...props 
}, ref) => {
  const computedStyle = {
    ...position,
    ...style
  };

  return (
    <div
      ref={ref}
      className={panelVariants({ variant, size, className })}
      style={computedStyle}
      {...props}
    >
      {title && (
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
});

Panel.displayName = "Panel";

export default Panel;