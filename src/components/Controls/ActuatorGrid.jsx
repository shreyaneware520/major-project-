import React from 'react';
import { Droplet, Sun, Wind, FlaskConical, CloudRain, Thermometer, ToggleLeft, ToggleRight, Zap } from 'lucide-react';

const icons = {
  droplet: Droplet,
  sun: Sun,
  wind: Wind,
  flask: FlaskConical,
  'cloud-rain': CloudRain,
  thermometer: Thermometer,
};

const ActuatorCard = ({ actuator, onToggle, onValueChange, onModeToggle }) => {
  const Icon = icons[actuator.icon] || Droplet;
  const isPump = actuator.type === 'pump';
  const isLight = actuator.type === 'light';
  const isDoser = actuator.type === 'doser';
  const isFan = actuator.type === 'fan';
  const isHumidifier = actuator.type === 'humidifier';
  const isHeater = actuator.type === 'heater';

  return (
    <div className={`bg-[#131c2e] border rounded-2xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
      actuator.status ? 'border-[#00ff88]/30 shadow-[0_0_20px_rgba(0,255,136,0.02)]' : 'border-slate-800/80 hover:border-slate-700/80'
    }`}>
      {/* Top row */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border transition-all ${
              actuator.status 
                ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20 scale-105' 
                : 'bg-[#0a0f1a] text-gray-500 border-slate-800'
            }`}>
              <Icon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">{actuator.name}</h3>
              <p className="text-[10px] text-gray-500 font-mono mt-1">{actuator.pin}</p>
            </div>
          </div>

          {/* Mode Badge (Auto/Manual) */}
          <button
            onClick={() => onModeToggle(actuator.id)}
            className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider transition-all cursor-pointer ${
              actuator.mode === 'auto'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {actuator.mode}
          </button>
        </div>

        {/* Current status display */}
        <div className="mb-4">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">State status</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <h4 className="text-xl font-bold text-white">
              {isDoser ? 'Ready' : actuator.status ? 'Active' : 'Standby'}
            </h4>
            {actuator.status && !isDoser && (
              <span className="text-xs text-[#00ff88] font-bold">
                ({actuator.value} {actuator.unit})
              </span>
            )}
          </div>
        </div>

        {/* Action controllers (sliders or trigger buttons) */}
        <div className="my-3 space-y-4">
          {/* Sliders for active controls */}
          {actuator.status && isPump && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>Flow rate setting</span>
                <span className="text-white">{actuator.value} L/min</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.1"
                value={actuator.value}
                onChange={(e) => onValueChange(actuator.id, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#0a0f1a] rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
              />
            </div>
          )}

          {actuator.status && isLight && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>Intensity PWM</span>
                <span className="text-white">{actuator.value}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={actuator.value}
                onChange={(e) => onValueChange(actuator.id, parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#0a0f1a] rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
              />
            </div>
          )}

          {actuator.status && isFan && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>Fan speed setting</span>
                <span className="text-white">{actuator.value} RPM</span>
              </div>
              <input
                type="range"
                min="400"
                max="2400"
                step="100"
                value={actuator.value}
                onChange={(e) => onValueChange(actuator.id, parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#0a0f1a] rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
              />
            </div>
          )}

          {actuator.status && isHumidifier && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>Target humidity</span>
                <span className="text-white">{actuator.value}% RH</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                step="1"
                value={actuator.value}
                onChange={(e) => onValueChange(actuator.id, parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#0a0f1a] rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
              />
            </div>
          )}

          {actuator.status && isHeater && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>Target temperature</span>
                <span className="text-white">{actuator.value}°C</span>
              </div>
              <input
                type="range"
                min="16"
                max="32"
                step="0.5"
                value={actuator.value}
                onChange={(e) => onValueChange(actuator.id, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#0a0f1a] rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
              />
            </div>
          )}

          {isDoser && (
            <div className="flex gap-2">
              <input
                type="number"
                value={actuator.value}
                onChange={(e) => onValueChange(actuator.id, parseInt(e.target.value) || 0)}
                placeholder="100"
                className="w-20 bg-[#0a0f1a] border border-slate-800 rounded-lg text-xs font-bold text-center text-white px-2 py-1.5 focus:outline-none focus:border-[#00ff88]"
              />
              <button
                onClick={() => {
                  onToggle(actuator.id);
                  setTimeout(() => onToggle(actuator.id), 2500); // momentary pulse trigger
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  actuator.status
                    ? 'bg-[#00ff88] text-black border-transparent shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                    : 'bg-[#00ff88]/5 text-[#00ff88] border-[#00ff88]/20 hover:bg-[#00ff88]/10'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {actuator.status ? 'Dispensing...' : 'Dispense dose'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Toggle Switch */}
      {!isDoser && (
        <div className="mt-4 pt-3.5 border-t border-slate-800/40 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">Cons: {actuator.power}</span>
          <button
            onClick={() => onToggle(actuator.id)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {actuator.status ? (
              <ToggleRight className="w-9 h-9 text-[#00ff88]" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-gray-600" />
            )}
          </button>
        </div>
      )}
      {isDoser && (
        <div className="mt-4 pt-3.5 border-t border-slate-800/40 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">Cons: {actuator.power}</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Momentary solenoid</span>
        </div>
      )}

      {/* Back decoration glow */}
      <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 w-16 h-16 bg-[#00ff88]/5 rounded-full blur-xl group-hover:bg-[#00ff88]/10 transition-all duration-300" />
    </div>
  );
};

const ActuatorGrid = ({ actuators, onToggle, onValueChange, onModeToggle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actuators.map((act) => (
        <ActuatorCard
          key={act.id}
          actuator={act}
          onToggle={onToggle}
          onValueChange={onValueChange}
          onModeToggle={onModeToggle}
        />
      ))}
    </div>
  );
};

export default ActuatorGrid;
