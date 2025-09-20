
// FOR FUTURE USE 


// import React, { useState } from 'react';
// import { supabase } from '../supabaseClient';

// const PhoneAuth = ({ onSuccess }) => {
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState(1);
//   const [error, setError] = useState('');

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setError('');
//     const { error } = await supabase.auth.signInWithOtp({ phone });
//     if (error) setError(error.message);
//     else setStep(2);
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setError('');
//     const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
//     if (error) setError(error.message);
//     else if (onSuccess) onSuccess(data);
//   };

//   return (
//     <div className="space-y-4">
//       {step === 1 ? (
//         <form onSubmit={handleSendOtp} className="space-y-4">
//           <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="input input-bordered w-full" required />
//           <button type="submit" className="btn btn-primary w-full">Send OTP</button>
//           {error && <div className="text-red-500 text-sm text-center">{error}</div>}
//         </form>
//       ) : (
//         <form onSubmit={handleVerifyOtp} className="space-y-4">
//           <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="input input-bordered w-full" required />
//           <button type="submit" className="btn btn-primary w-full">Verify OTP</button>
//           {error && <div className="text-red-500 text-sm text-center">{error}</div>}
//         </form>
//       )}
//     </div>
//   );
// };

// export default PhoneAuth;
