import React from 'react';

const ProfileCard = ({ user }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
    <img src={user?.avatar || '/assets/logo.png'} alt="User" className="w-16 h-16 rounded-full object-cover" />
    <div>
      <div className="font-bold text-lg">{user?.name || 'User Name'}</div>
      <div className="text-gray-500">{user?.email || 'user@email.com'}</div>
    </div>
  </div>
);

export default ProfileCard;
