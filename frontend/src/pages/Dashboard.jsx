import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md shadow-cyan-500/10">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Enterprise AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.full_name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-slate-700/60 flex items-center justify-center text-sm font-bold text-cyan-400">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">{user?.full_name || 'Explorer'}</span>
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl">
            This is your secure, enterprise-grade cognitive workspace. Select a module below to start reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group p-[1px] bg-gradient-to-tr from-slate-800 to-slate-800/40 hover:from-cyan-500/30 hover:to-indigo-500/30 rounded-2xl transition-all duration-300 shadow-md">
            <div className="bg-slate-900/90 rounded-[15px] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cognitive Chat</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Interactive multi-turn conversation backed by advanced large language models with contextual routing.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Configure Chat</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group p-[1px] bg-gradient-to-tr from-slate-800 to-slate-800/40 hover:from-cyan-500/30 hover:to-indigo-500/30 rounded-2xl transition-all duration-300 shadow-md">
            <div className="bg-slate-900/90 rounded-[15px] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Knowledge Base</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Upload PDF, Markdown, or text documents to chunk, embed, and store in pgVector for semantic search.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-indigo-400 gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Manage Files</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group p-[1px] bg-gradient-to-tr from-slate-800 to-slate-800/40 hover:from-cyan-500/30 hover:to-indigo-500/30 rounded-2xl transition-all duration-300 shadow-md">
            <div className="bg-slate-900/90 rounded-[15px] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Agentic Hub</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Deploy autonomous planners and retrievers equipped with reflection and dynamic memory structures.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-violet-400 gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Configure Agents</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
