import { useState, useEffect } from 'react';
import { Home, RefreshCw } from 'lucide-react';

export default function PageNotFound() {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="space-y-8">
          <div className="flex justify-center items-center space-x-4">
            <div className="text-8xl font-bold text-indigo-500">4</div>
            <div 
              className="text-8xl font-bold text-indigo-600 transform transition-transform"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              0
            </div>
            <div className="text-8xl font-bold text-indigo-500">4</div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
            <p className="text-gray-600">
              Oops! The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex justify-center space-x-2 py-4">
            {[0, 1, 2, 3, 4].map((dot) => (
              <div 
                key={dot}
                className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
                style={{ 
                  animationDelay: `${dot * 0.1}s`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh Page</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        © 2025 | All Rights Reserved
      </div>
    </div>
  );
}