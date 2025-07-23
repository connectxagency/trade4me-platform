import React from 'react';
import { Network } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-64 h-64 bg-white rounded-2xl shadow-2xl">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
          <Network className="w-12 h-12 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Trade4Me</h1>
          <p className="text-gray-600 text-sm mt-1">Professional Network</p>
        </div>
      </div>
    </div>
  );
};

export default Logo;