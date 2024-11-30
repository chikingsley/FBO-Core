// src/components/ui/ApiDocsButton.jsx
import React from 'react';
import { FileText } from 'lucide-react';
import Button from './Button';

const ApiDocsButton = ({ onToggle, className = '' }) => {
  return (
    <Button
      onClick={onToggle}
      variant="secondary"
      className={`fixed bottom-5 right-5 z-50 ${className}`}
    >
      <FileText className="mr-2 h-4 w-4" />
      API Docs
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