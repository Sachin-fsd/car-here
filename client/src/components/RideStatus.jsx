import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

const RideStatus = ({ rideId }) => {
  const [status, setStatus] = useState('pending');
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    if (!rideId) return;
    if (!socket.connected) socket.connect();
    socket.emit('joinRideRoom', rideId);
    socket.on('rideAccepted', ({ driverId }) => {
      setStatus('accepted');
      setDriver(driverId);
    });
    socket.on('rideStatusUpdate', ({ status }) => {
      setStatus(status);
    });
    return () => {
      socket.off('rideAccepted');
      socket.off('rideStatusUpdate');
    };
  }, [rideId]);

  return (
    <div className="my-4 text-center">
      <div className="font-bold">Ride Status: <span className="capitalize">{status}</span></div>
      {driver && <div>Accepted by driver: {driver}</div>}
    </div>
  );
};

export default RideStatus;
