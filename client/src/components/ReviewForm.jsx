import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ReviewForm = ({ rideId, userId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/reviews/rate`, { rideId, userId, rating, comment });
      setMessage('Review submitted!');
    } catch (err) {
      setMessage('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <div>
        <label className="mr-2">Rating:</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="select select-bordered">
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" className="textarea textarea-bordered w-full" />
      <button type="submit" className="btn btn-primary w-full">Submit Review</button>
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );
};

export default ReviewForm;
