import React, { useState } from 'react';
import { bookRide } from '../api';

const RideBookingForm = ({ user_id }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [fare, setFare] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookRide(user_id, pickup, dropoff, fare);
      setMessage('Ride booked successfully!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Pickup Location" value={pickup} onChange={e => setPickup(e.target.value)} className="input input-bordered w-full" required />
      <input type="text" placeholder="Dropoff Location" value={dropoff} onChange={e => setDropoff(e.target.value)} className="input input-bordered w-full" required />
      <input type="number" placeholder="Fare" value={fare} onChange={e => setFare(e.target.value)} className="input input-bordered w-full" required />
      <button type="submit" className="btn btn-primary w-full">Book Ride</button>
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );
};

export default RideBookingForm;
