import React, { useEffect, useState } from 'react';
import { getRideHistory } from '../api';

const RideHistory = ({ user_id }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    getRideHistory(user_id)
      .then(res => setRides(res.data.rides))
      .catch(() => setRides([]))
      .finally(() => setLoading(false));
  }, [user_id]);

  if (!user_id) return <div className="text-center">Please log in to view your ride history.</div>;
  if (loading) return <div className="text-center">Loading...</div>;
  if (!rides.length) return <div className="text-center">No rides found.</div>;

  return (
    <div className="overflow-x-auto w-full max-w-2xl mx-auto mt-8">
      <h3 className="text-xl font-bold mb-4">Your Ride History</h3>
      <table className="table w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>Pickup</th>
            <th>Dropoff</th>
            <th>Fare</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rides.map(ride => (
            <tr key={ride.id}>
              <td>{ride.pickup}</td>
              <td>{ride.dropoff}</td>
              <td>${ride.fare}</td>
              <td>{ride.status}</td>
              <td>{new Date(ride.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RideHistory;
