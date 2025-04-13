import React, { useState, useEffect } from 'react';
import { Star, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(import.meta.env.VITE_USER_DETAILS_GET);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const sortedReviews = [...reviews]
    .filter(review => filterRating === 0 || review.rating === filterRating)
    .filter(review => 
      review.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        // Assuming each review has a createdAt timestamp
        return sortOrder === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === 'room') {
        return sortOrder === 'asc'
          ? a.roomId.localeCompare(b.roomId)
          : b.roomId.localeCompare(a.roomId);
      }
      return 0;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Reviews</h3>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={fetchReviews}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Guest Reviews</h1>
          <p className="mt-2 text-gray-600">Manage and respond to guest feedback</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by room, guest, or review content"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Rating</label>
                <div className="flex items-center space-x-1">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className={`p-2 rounded-full transition-colors ${
                        filterRating === rating 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      onClick={() => setFilterRating(rating)}
                    >
                      {rating === 0 ? 'All' : (
                        <div className="flex items-center">
                          <span>{rating}</span>
                          <Star size={16} fill="#FFC107" color="#FFC107" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              

            </div>
          </div>
        </div>

        {sortedReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gray-100">
                <Filter size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {searchTerm || filterRating > 0 
                ? "Try adjusting your filters to see more results" 
                : "There are no reviews submitted yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Room: {review.roomId}
                      </h3>
                      <p className="text-gray-600">
                        Guest: {review.username}
                      </p>
                    </div>
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <span className="font-medium mr-1">{review.rating}</span>
                      <Star size={16} fill="#FFC107" color="#FFC107" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          fill={review.rating >= star ? "#FFC107" : "none"}
                          color={review.rating >= star ? "#FFC107" : "#CBD5E0"}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{review.review}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          {reviews.length > 0 && (
            <div className="inline-flex items-center bg-white px-2 py-1 rounded-lg shadow-sm">
              <button className="px-3 py-1 text-gray-600 hover:text-indigo-600 disabled:opacity-50">
                Previous
              </button>
              <span className="mx-2 px-3 py-1 rounded-md bg-indigo-600 text-white">1</span>
              <button className="px-3 py-1 text-gray-600 hover:text-indigo-600 disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}