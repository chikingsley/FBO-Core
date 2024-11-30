// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ 
  className = '',
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled = false,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? React.Fragment : 'button';
  
  // Base styles similar to shadcn
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  // Variant styles matching shadcn design
  const variants = {
    default: 'bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
    destructive: 'bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
    outline: 'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
    ghost: 'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
    link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50'
  };
  
  // Size styles matching shadcn
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <Comp
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';

// Example usage component
const ButtonDemo = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
      </div>
      
      <div className="flex gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default Size</Button>
        <Button size="lg">Large</Button>
      </div>
      
      <div className="flex gap-4">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      
      <Button size="icon">
        <span className="h-4 w-4">🔍</span>
      </Button>
    </div>
  );
};

export default Button;