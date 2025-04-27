import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleKofiClick = () => {
    window.open('https://ko-fi.com/L3L71E2QDX', '_blank');
  };

  const handleSaweriaClick = () => {
    window.open('https://saweria.co/andisusanto1999', '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-2 min-w-[200px]">
          <div className="space-y-3">
            <button
              onClick={handleKofiClick}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#5bc0de] rounded-md hover:bg-[#4fadd0] transition-colors"
            >
              Support on Ko-fi
            </button>
            <button
              onClick={handleSaweriaClick}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#ff6b6b] rounded-md hover:bg-[#ff5252] transition-colors"
            >
              Support on Saweria
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg transition-colors"
        aria-label="Support options"
      >
        <Heart size={24} className={`${isOpen ? 'fill-current' : ''} transition-colors`} />
      </button>
    </div>
  );
};

export default SupportWidget;