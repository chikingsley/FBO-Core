// src/components/ui/ApiDocsButton.jsx
import React from 'react';
import { FileText } from 'lucide-react';
import Button from './Button';

const ApiDocsButton = ({ onToggle, className = '' }) => {
  return (
    <Button
      onClick={onToggle}
      variant="secondary"
      size="sm"
      className={`relative flex items-center gap-2 ${className}`}
    >
      <FileText className="h-4 w-4" />
      <span>API Docs</span>
    </Button>
  );
};

// Example usage showing different positions and styles
const ApiDocsDemo = () => {
  const handleToggle = () => {
    console.log('Toggling API docs...');
  };

  return (
    <div>
      {/* Default bottom-right positioning */}
      <ApiDocsButton onToggle={handleToggle} />
      
      {/* Custom positioning example */}
      <ApiDocsButton 
        onToggle={handleToggle}
        className="bottom-20 right-5" 
      />
    </div>
  );
};

export default ApiDocsButton;