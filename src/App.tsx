import React from 'react'
import { REACHApp } from './components/REACHApp';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* iPhone Mockup Frame */}
      <div className="relative">
        {/* iPhone Frame */}
        <div className="w-[375px] h-[812px] bg-black rounded-[60px] p-2 shadow-2xl">
          {/* iPhone Screen */}
          <div className="w-full h-full bg-white rounded-[50px] overflow-hidden relative">
            {/* iPhone Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-black rounded-b-2xl z-10"></div>
            
            {/* App Content */}
            <div className="size-full relative z-0">
              <REACHApp />
            </div>
          </div>
        </div>
        
        {/* iPhone Details */}
        <div className="absolute top-20 -left-1 w-1 h-12 bg-gray-800 rounded-l-sm"></div>
        <div className="absolute top-40 -left-1 w-1 h-16 bg-gray-800 rounded-l-sm"></div>
        <div className="absolute top-60 -left-1 w-1 h-16 bg-gray-800 rounded-l-sm"></div>
        <div className="absolute top-40 -right-1 w-1 h-20 bg-gray-800 rounded-r-sm"></div>
      </div>
    </div>
  );
}