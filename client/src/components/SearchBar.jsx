import React from 'react';

const SearchBar = ({ pickup, dropoff, onPickupChange, onDropoffChange }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 bg-gray-100 rounded px-4 py-3">
        <span className="material-icons text-black">radio_button_checked</span>
        <input type="text" placeholder="Pickup location" value={pickup} onChange={onPickupChange} className="bg-transparent outline-none w-full" />
      </div>
      <div className="flex items-center gap-2 bg-gray-100 rounded px-4 py-3">
        <span className="material-icons text-black">stop</span>
        <input type="text" placeholder="Dropoff location" value={dropoff} onChange={onDropoffChange} className="bg-transparent outline-none w-full" />
        <button className="ml-2"><span className="material-icons">add</span></button>
      </div>
    </div>
  );
};

export default SearchBar;
