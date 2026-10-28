import React from 'react';
import { Sprout } from 'lucide-react';
import GrowRoomCard from './GrowRoomCard';

const GrowRoomGrid = ({ rooms }) => {
  if (rooms.length === 0) {
    return (
      <div className="bg-[#131c2e] border border-slate-800/80 rounded-2xl p-16 text-center">
        <Sprout className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-400 mb-2">No Rooms Found</h3>
        <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <GrowRoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default GrowRoomGrid;
