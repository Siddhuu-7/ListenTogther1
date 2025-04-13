import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function Review({ setIsReviewOpen }) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handlePostUserDetails = async () => {
    try {
      const data = {
        roomId: localStorage.getItem('roomId'),
        username: localStorage.getItem('username'),
        review,
        rating
      };
      
      await fetch(import.meta.env.VITE_USER_DETAILS_POST, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.log(error);
    }
    sessionStorage.setItem('review',true)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Leave a Review</h2>
          <button 
            onClick={() => setIsReviewOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-gray-700 mb-1">Room:</div>
          <div className="font-medium text-gray-900">{localStorage.getItem('roomId')}</div>
          <div className="text-gray-700 mt-3 mb-1">Guest:</div>
          <div className="font-medium text-gray-900">{localStorage.getItem('username')}</div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-colors"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  size={32}
                  fill={(hoverRating || rating) >= star ? "#FFC107" : "none"}
                  color={(hoverRating || rating) >= star ? "#FFC107" : "#CBD5E0"}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {rating === 0 ? "Select a rating" : 
             rating === 1 ? "Poor" :
             rating === 2 ? "Fair" :
             rating === 3 ? "Good" :
             rating === 4 ? "Very Good" : "Excellent"}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Your Review</label>
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-sm"
            placeholder="Share your experience with this stay..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsReviewOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (rating > 0) {
                handlePostUserDetails();
                setIsReviewOpen(false);
              }
            }}
            disabled={rating === 0}
            className={`px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors ${
              rating === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}