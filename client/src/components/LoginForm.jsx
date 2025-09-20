import React, { useState } from 'react';
import { loginUser } from '../api';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      login(res.data.user); // set user context
      setMessage('Login successful!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input input-bordered w-full" required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input input-bordered w-full" required />
      <button type="submit" className="btn btn-primary w-full">Login</button>
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );
};

export default LoginForm;
