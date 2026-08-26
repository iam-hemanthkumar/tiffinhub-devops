import React, { useState } from 'react';
import { X, Phone, User, Sparkles } from 'lucide-react';
import { CustomerProfile } from '../types';
import { registerCustomer, loginCustomer } from '../lib/api';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: CustomerProfile) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const lettersOnly = val.replace(/[^A-Za-z\s]/g, '');
    setName(lettersOnly);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (name.trim()) {
      const letterRegex = /^[A-Za-z\s]+$/;
      if (!letterRegex.test(name.trim())) {
        setError('Name must contain letters only (no numbers or symbols)');
        return;
      }
    }

    try {
      setIsLoading(true);
      const res = await registerCustomer(cleanMobile, name.trim());
      onSuccess(res.customer);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim()) {
      setError('Please enter your Mobile number or Token');
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginCustomer(loginIdentifier.trim());
      onSuccess(res.customer);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Customer not found. Please register first.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          id="btn-close-register-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Customer Authentication</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900">
            {mode === 'register' ? 'Register Customer' : 'Login with Token or Mobile'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Order unlimited tiffins & track your kitchen token status.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            id="tab-modal-register"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            New Customer
          </button>
          <button
            type="button"
            id="tab-modal-login"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Existing Login
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {mode === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-xs flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91</span>
                </div>
                <input
                  id="input-modal-reg-mobile"
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full pl-16 pr-3 py-2.5 text-sm bg-stone-50 rounded-xl border border-stone-200 font-mono focus:outline-hidden focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">
                  Customer Name <span className="text-stone-400 text-[11px] font-normal">(Optional)</span>
                </label>
                <span className="text-[10px] text-stone-400">Letters only</span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-modal-reg-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              id="btn-modal-submit-register"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Generating Token...' : 'Register & Get Token'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mobile Number OR Token
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-modal-login-identifier"
                  type="text"
                  placeholder="e.g. 9876543210 or Token"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 rounded-xl border border-stone-200 font-mono focus:outline-hidden focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              id="btn-modal-submit-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying...' : 'Login to Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
