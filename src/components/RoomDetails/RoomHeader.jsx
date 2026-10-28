import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';

const RoomHeader = ({ room = {} }) => {
  
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6">
      {/* Back navigation */}
      <Link 
        to="/grow-rooms" 
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#00ff88] transition-all cursor-pointer w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Grow Rooms
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Room Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center text-3xl">
            {room?.cropIcon || '🌱'}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{room?.name || 'Grow Room'}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
              <span className="font-mono text-[#00ff88] font-bold">{room?.id || 'GR-000'}</span>
              <span className="text-gray-700">•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {room?.zone || 'Zone A'}</span>
              <span className="text-gray-700">•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-500" /> {room?.daysActive || 0} Days Active</span>
            </div>
          </div>
        </div>

        {/* Live Badges */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
            room?.status === 'online' 
              ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30' 
              : room?.status === 'alert'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
          }`}>
            <span className={`relative flex h-2 w-2`}>
              {room?.status === 'online' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                room?.status === 'online' ? 'bg-[#00ff88]' : room?.status === 'alert' ? 'bg-amber-400' : 'bg-gray-500'
              }`}></span>
            </span>
            {room?.status || 'offline'} Feed
          </span>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
            room?.health === 'Healthy'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : room?.health === 'Needs Attention'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            Health: {room?.health || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
