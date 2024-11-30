import React, { forwardRef } from 'react';

const Label = forwardRef(({ 
  text,
  position = { top: '20px', left: '20px' },
  className,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        fixed px-3 py-2 
        bg-black/70 text-white 
        rounded backdrop-blur-sm
        text-xs font-mono
        flex items-center gap-2
        select-none
        ${className || ''}
      `}
      style={position}
      {...props}
    >
      {text}
    </div>
  );
});

Label.displayName = "Label";

export default Label;