
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register({ name, email, phone, password });
      navigate('/home', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="w-full max-w-sm mx-auto bg-dark-surface p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-dark-text mb-2">Create Account</h1>
        <p className="text-center text-dark-text-secondary mb-6">Get started with ProLink.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-dark-text focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-dark-text focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-dark-text-secondary">Phone Number</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-dark-text focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-dark-text-secondary">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-dark-text focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-brand-primary disabled:bg-gray-500">
              {isLoading ? <LoadingSpinner /> : 'Create Account'}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-dark-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-primary hover:text-indigo-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
