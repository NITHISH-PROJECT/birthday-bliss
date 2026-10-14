import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0813] text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-400 p-0.5 mx-auto mb-6 shadow-2xl">
        <div className="w-full h-full bg-[#130b22] rounded-[22px] flex items-center justify-center text-4xl">
          🎂
        </div>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold font-display mb-3">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        Oops! It looks like this party was moved or this link does not exist.
      </p>

      <div className="flex gap-4">
        <Link
          to="/"
          className="px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/create"
          className="px-6 py-3 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
        >
          <Gift className="w-4 h-4" />
          <span>Create Surprise</span>
        </Link>
      </div>
    </div>
  );
};
