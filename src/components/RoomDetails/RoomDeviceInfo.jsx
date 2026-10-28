import React from 'react';
import { Cpu } from 'lucide-react';
import { MOCK_DEVICE_INFO } from './roomDetailData';

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-800/40 text-sm">
    <span className="text-gray-400 font-medium">{label}</span>
    <span className="text-white font-semibold font-mono text-xs">{value}</span>
  </div>
);

const RoomDeviceInfo = ({ room }) => {
  const isOffline = room.status === 'offline';
  
  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800/60 pb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Device Hardware Specs</h3>
            <p className="text-xs text-gray-400">Node controller config & status</p>
          </div>
        </div>

        <div className="space-y-1">
          <InfoRow label="Hardware model" value={MOCK_DEVICE_INFO.hardwareModel} />
          <InfoRow label="Firmware version" value={MOCK_DEVICE_INFO.firmwareVersion} />
          <InfoRow label="Assigned sensor ID" value={room.sensorId} />
          <InfoRow label="Uptime" value={isOffline ? '0s' : MOCK_DEVICE_INFO.uptime} />
          <InfoRow label="Uplink Protocol" value={MOCK_DEVICE_INFO.connectionProtocol} />
          <InfoRow label="Uplink Frequency" value={MOCK_DEVICE_INFO.dataTransmitRate} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between p-3.5 bg-[#0a0f1a] border border-slate-800/80 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            {!isOffline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOffline ? 'bg-gray-500' : 'bg-emerald-400'}`}></span>
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-white leading-none">Uplink Signal</p>
            <p className="text-[10px] text-gray-400 mt-1">{isOffline ? 'Disconnected' : `${MOCK_DEVICE_INFO.signalStrength}% RSSI`}</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-gray-300 bg-[#131c2e] px-2 py-0.5 rounded border border-slate-800">
          Uplink OK
        </span>
      </div>
    </div>
  );
};

export default RoomDeviceInfo;
