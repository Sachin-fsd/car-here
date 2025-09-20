import React, { useState } from 'react';
import { registerUser } from '../api';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('rider');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password, role);
      setMessage('Registration successful!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input input-bordered w-full" required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input input-bordered w-full" required />
      <select value={role} onChange={e => setRole(e.target.value)} className="select select-bordered w-full">
        <option value="rider">Rider</option>
        <option value="driver">Driver</option>
      </select>
      <button type="submit" className="btn btn-primary w-full">Register</button>
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );
};

export default RegisterForm;
