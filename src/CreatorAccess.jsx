import React, { useState } from 'react';
import { Key, ArrowLeft, Eye, EyeOff, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const CreatorAuthPage = () => {
  const [creatorKey, setCreatorKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
 const navigate=useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!creatorKey.trim()) {
      setError('Please enter your creator key');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    setTimeout(() => {
      setSubmitting(false);
      if (creatorKey === 'demo123') { 
        setSuccess(true);
        navigate('/Admin',{replace:true})
      } else {
        setError('Invalid creator key. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex items-center mb-6">
          <button 
            onClick={()=>navigate('/',{replace:true})}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-center flex-1 text-gray-800">Creator Access</h2>
        </div>

        <div className="flex justify-center mb-8">
          <div className="p-4 bg-indigo-50 rounded-full">
            <Key className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-800">Successfully Authenticated</h3>
           
            
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="creatorKey" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Creator Key
              </label>
              <div className="relative">
                <input
                  id="creatorKey"
                  type={showKey ? "text" : "password"}
                  value={creatorKey}
                  onChange={(e) => setCreatorKey(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter your unique creator key"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {error && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <X className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-md transition-all duration-300 ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Verifying..." : "Access Creator Hub"}
            </button>

            
          </form>
        )}

        <div className="mt-8 flex justify-between">
          <div className="h-3 w-3 rounded-full bg-indigo-300 opacity-30" />
          <div className="h-2 w-2 rounded-full bg-purple-300 opacity-20" />
          <div className="h-4 w-4 rounded-full bg-pink-300 opacity-25" />
        </div>
      </div>
    </div>
  );
};

export default CreatorAuthPage;