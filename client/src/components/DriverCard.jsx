import React from 'react';

const DriverCard = ({ driver }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
    <img src={driver?.avatar || '/assets/car_embedded.svg'} alt="Driver" className="w-16 h-16 rounded-full object-cover" />
    <div>
      <div className="font-bold text-lg">{driver?.name || 'Driver Name'}</div>
      <div className="text-gray-500">{driver?.car || 'Car Model'}</div>
      <div className="text-green-600 font-semibold">{driver?.status || 'On the way'}</div>
    </div>
  </div>
);

export default DriverCard;
