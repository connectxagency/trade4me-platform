import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

interface HelpCenterButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: 'blue' | 'green' | 'purple';
}

const HelpCenterButton: React.FC<HelpCenterButtonProps> = ({ 
  position = 'bottom-right',
  color = 'blue'
}) => {
  const navigate = useNavigate();

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-24 right-6',
    'top-left': 'top-24 left-6'
  };

  const colorClasses = {
    'blue': 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
    'green': 'bg-green-600 hover:bg-green-700 shadow-green-600/20',
    'purple': 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
  };

  return (
    <button
      onClick={() => navigate('/help')}
      className={`fixed ${positionClasses[position]} ${colorClasses[color]} text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
      aria-label="Help Center"
    >
      <HelpCircle className="w-6 h-6" />
    </button>
  );
};

export default HelpCenterButton;