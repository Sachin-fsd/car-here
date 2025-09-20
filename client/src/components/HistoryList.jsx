import React from 'react';

const HistoryList = ({ rides }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <div className="font-bold text-lg mb-2">Ride History</div>
    <ul className="divide-y">
      {(rides || []).map((ride, idx) => (
        <li key={idx} className="py-2 flex justify-between items-center">
          <span>{ride.pickup} → {ride.dropoff}</span>
          <span className="text-gray-500">${ride.fare}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default HistoryList;
