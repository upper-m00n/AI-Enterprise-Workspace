import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchCurrentUser } from '../features/auth/authSlice';

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { token, user, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && !initialized) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, initialized, dispatch]);

  if (token && !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Loading workspace session...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
