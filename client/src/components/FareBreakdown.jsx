import React from 'react';

const FareBreakdown = ({ fare }) => (
  <div className="bg-gray-50 rounded p-4 shadow text-lg font-bold">
    {fare ? `Estimated Fare: $${fare}` : 'Select route & car type'}
  </div>
);

export default FareBreakdown;
