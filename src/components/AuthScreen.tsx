import React, { useState } from 'react';
import { UtensilsCrossed, Phone, User, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { CustomerProfile } from '../types';
import { registerCustomer, loginCustomer } from '../lib/api';

interface AuthScreenProps {
  onAuthSuccess: (customer: CustomerProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newlyRegistered, setNewlyRegistered] = useState<CustomerProfile | null>(null);

  // Handle letters-only name input (no numbers, no special symbols)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Keep only letters and spaces
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
      setNewlyRegistered(res.customer);
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
      setError('Please enter your 10-digit Mobile number or Token number');
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginCustomer(loginIdentifier.trim());
      onAuthSuccess(res.customer);
    } catch (err: any) {
      setError(err.message || 'Account not found. Please register first.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center px-4 py-8 relative selection:bg-amber-500 selection:text-white">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* TiffinHub Brand Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/25 mx-auto mb-4 border-2 border-white/80">
            <UtensilsCrossed className="w-10 h-10" />
          </div>

          <h1 className="text-4xl font-black text-stone-900 tracking-tight">
            Tiffin<span className="text-amber-600">Hub</span>
          </h1>

          <p className="text-sm text-stone-600 mt-1 max-w-xs mx-auto font-medium">
            Unlimited Tiffins & Homestyle Meals Daily
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-200 text-amber-900 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Eat All You Want • Unlimited Refills</span>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/90">
          {newlyRegistered ? (
            /* Registration Token Reveal */
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-stone-900">
                  Welcome to TiffinHub!
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Your token has been generated for today.
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center">
                <div className="text-[11px] uppercase tracking-wider font-bold text-amber-800">
                  Your Today's Token Number
                </div>
                <div className="text-4xl font-black text-amber-950 tracking-wider font-mono my-1.5">
                  #{newlyRegistered.customerToken}
                </div>
                <div className="text-xs text-stone-600">
                  Name: <span className="font-semibold text-stone-900">{newlyRegistered.name}</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Mobile: +91 {newlyRegistered.mobile}
                </div>
              </div>

              <button
                id="btn-start-ordering-after-reg"
                onClick={() => onAuthSuccess(newlyRegistered)}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>View Menu & Start Ordering</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              {/* Toggle Switcher: Login or Register */}
              <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl mb-6 text-xs font-bold">
                <button
                  type="button"
                  id="tab-login"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`py-2.5 rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Customer Login
                </button>
                <button
                  type="button"
                  id="tab-register"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className={`py-2.5 rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  New Registration
                </button>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}

              {mode === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Mobile Number or Token Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-login-identifier"
                        type="text"
                        placeholder="e.g. 9876543210 or Token (1, 2, ...)"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        required
                        className="w-full pl-10 pr-3.5 py-3 text-sm bg-stone-50 rounded-xl border border-stone-200 font-mono focus:outline-hidden focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1.5">
                      Demo quick login: <button type="button" onClick={() => setLoginIdentifier('9876543210')} className="font-mono text-amber-800 font-bold underline">9876543210</button> or Token <button type="button" onClick={() => setLoginIdentifier('1')} className="font-mono text-amber-800 font-bold underline">1</button>
                    </p>
                  </div>

                  <button
                    id="btn-submit-login"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Verifying...' : (
                      <>
                        <span>Login to View Menu</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-stone-500">
                      New customer?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setError('');
                        }}
                        className="font-bold text-amber-700 hover:underline"
                      >
                        Register for today's token
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-semibold text-xs flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>+91</span>
                      </div>
                      <input
                        id="input-register-mobile"
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-full pl-16 pr-3.5 py-3 text-sm bg-stone-50 rounded-xl border border-stone-200 font-mono focus:outline-hidden focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Customer Name <span className="text-stone-400 text-[11px] font-normal">(Optional)</span>
                      </label>
                      <span className="text-[10px] font-medium text-stone-400">Letters only</span>
                    </div>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-register-name"
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full pl-10 pr-3.5 py-3 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">
                      Only alphabets and spaces accepted (no numbers or special characters).
                    </p>
                  </div>

                  <button
                    id="btn-submit-register"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Creating Profile...' : (
                      <>
                        <span>Register & Get Daily Token</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-stone-500">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setError('');
                        }}
                        className="font-bold text-stone-900 hover:underline"
                      >
                        Log in here
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="text-center text-xs text-stone-500 mt-6 font-medium">
          Daily token queue resets every night at 12:00 AM
        </div>
      </div>
    </div>
  );
};
