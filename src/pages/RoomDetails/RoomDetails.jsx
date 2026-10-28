import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  RoomHeader,
  RoomMetrics,
  RoomAnalytics,
  RoomNPK,
  RoomActivityLog,
  RoomDeviceInfo,
  getRoomById,
} from '../../components/RoomDetails';
import { Sprout, ArrowLeft } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const room = useMemo(() => getRoomById(id), [id]);

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-full bg-slate-800/40 text-gray-500 mb-4">
          <Sprout className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Grow Room Not Found</h2>
        <p className="text-gray-400 max-w-sm mb-6">
          The grow room ID "{id}" was not found in the facility registry database.
        </p>
        <Link
          to="/grow-rooms"
          className="flex items-center gap-2 bg-[#00ff88] hover:bg-[#00e67a] text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,255,136,0.25)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Grow Rooms
        </Link>
      </div>
    );
  }

  return (
    <main className="p-6 md:p-8 space-y-8 flex-1">
          {/* Header (Back link + title info + status badges) */}
          <RoomHeader room={room} />

          {/* Current Live Stats/Metrics Strip (6 cards) */}
          <RoomMetrics room={room} />

          {/* Analytics Section & Side Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Graph (2/3 width on desktop) */}
            <div className="lg:col-span-2">
              <RoomAnalytics room={room} />
            </div>

            {/* Room Device Uplink Node info (1/3 width) */}
            <div className="lg:col-span-1">
              <RoomDeviceInfo room={room} />
            </div>
          </div>

          {/* Soil NPK analysis and Activity log timelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RoomNPK room={room} />
            <RoomActivityLog />
          </div>
    </main>
  );
};

export default RoomDetails;
