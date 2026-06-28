import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser, clearError } from '../features/auth/authSlice';
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    const result = await dispatch(
      registerUser({
        email: data.email,
        password: data.password,
        full_name: data.fullName,
      })
    );
    if (registerUser.fulfilled.match(result)) {
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        dispatch(loginUser({ email: data.email, password: data.password }));
      }, 1000);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Atmospheric Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bg-blob" style={{ top: '-100px', right: '-100px', animationDelay: '0s' }}></div>
        <div className="bg-blob" style={{ bottom: '-100px', left: '-100px', animationDelay: '-10s' }}></div>
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[440px] flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-8 auth-card-shadow transition-all duration-300">
            {/* Header */}
            <header className="flex flex-col items-center mb-8">
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
                <Sparkles size={24} />
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Create Account</h1>
              <p className="text-xs text-slate-500 mt-1">Join Enterprise AI Workspace</p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-805 text-xs flex items-center gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={16} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 text-xs flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="fullName">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <User size={16} />
                  </div>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-transparent border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all outline-none"
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    {...register('fullName', {
                      required: 'Full name is required',
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-550 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-transparent border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all outline-none"
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-550 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="password">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    className="w-full pl-11 pr-11 py-3 bg-transparent border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs text-slate-850 placeholder:text-slate-400 focus:outline-none transition-all outline-none"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-550 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                className="w-full mt-6 bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Already have an account?
              <Link className="font-bold text-primary hover:underline transition-all ml-1" to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100 bg-white relative z-10 text-xs text-slate-400">
        <div>
          © 2026 Enterprise AI Workspace. All rights reserved.
        </div>
        <nav className="flex gap-4">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Security</a>
          <a className="hover:text-primary transition-colors" href="#">Status</a>
        </nav>
      </footer>
    </div>
  );
};

export default Register;
