import React from 'react';

const CAR_TYPES = [
  { type: 'bike', label: 'Bike', icon: '🚲', baseFare: 5.5 },
  { type: 'standard', label: 'Standard', icon: '🚗', baseFare: 8.9 },
  { type: 'premium', label: 'Premium', icon: '🚙', baseFare: 9.4 },
];

const RideTypeCard = ({ selectedType, onSelect }) => (
  <div className="flex gap-2">
    {CAR_TYPES.map(ct => (
      <button
        key={ct.type}
        className={`px-3 py-2 rounded border font-semibold ${selectedType === ct.type ? 'bg-blue-100 border-blue-700' : 'bg-gray-100 border-gray-300'}`}
        onClick={() => onSelect(ct.type)}
      >
        <span className="mr-2">{ct.icon}</span>{ct.label}
      </button>
    ))}
  </div>
);

export default RideTypeCard;
