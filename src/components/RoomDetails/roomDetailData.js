import { MOCK_GROW_ROOMS } from '../GrowRooms/growRoomData';

// ─── Find Room By ID ────────────────────────────────────────────────────

export const getRoomById = (id) => {
  if (!id) return null;
  const normalizedId = String(id).trim().toLowerCase();
  return (
    MOCK_GROW_ROOMS.find((r) => {
      const rId = r.id.toLowerCase();
      if (rId === normalizedId) return true;
      if (rId.replace(/[^a-z0-9]/g, '') === normalizedId.replace(/[^a-z0-9]/g, '')) return true;
      // Match numeric part e.g. "1" -> "GR-001"
      const numPart = rId.replace(/\D/g, '');
      const queryNum = normalizedId.replace(/\D/g, '');
      return queryNum && numPart && parseInt(numPart, 10) === parseInt(queryNum, 10);
    }) || MOCK_GROW_ROOMS[0] // Robust fallback to first room if unknown ID passed
  );
};

// ─── Extended Mock Data for Room Details ────────────────────────────────

export const generateChartHistory = (baseTemp, baseHumidity, points = 24) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now - (points - 1 - i) * 3600 * 1000);
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: parseFloat((baseTemp + (Math.random() - 0.5) * 4).toFixed(1)),
      humidity: parseFloat((baseHumidity + (Math.random() - 0.5) * 8).toFixed(1)),
      moisture: parseFloat((65 + (Math.random() - 0.5) * 12).toFixed(1)),
      light: Math.floor(400 + Math.random() * 800),
    };
  });
};

export const MOCK_ACTIVITY_LOG = [
  { id: 1, type: 'info', message: 'Telemetry data synced successfully', time: '2 min ago', icon: 'sync' },
  { id: 2, type: 'success', message: 'Irrigation cycle completed — 4.2L dispensed', time: '15 min ago', icon: 'water' },
  { id: 3, type: 'warning', message: 'Soil pH approaching lower threshold (5.8)', time: '42 min ago', icon: 'alert' },
  { id: 4, type: 'info', message: 'Light intensity adjusted to 850 Lux', time: '1h ago', icon: 'light' },
  { id: 5, type: 'success', message: 'Nutrient solution replenished — NPK balanced', time: '2h ago', icon: 'nutrient' },
  { id: 6, type: 'info', message: 'Temperature stabilized at optimal range', time: '3h ago', icon: 'temp' },
  { id: 7, type: 'warning', message: 'Fan speed increased due to rising temperature', time: '4h ago', icon: 'fan' },
  { id: 8, type: 'success', message: 'Daily growth measurement recorded: +0.8cm', time: '6h ago', icon: 'growth' },
];

export const MOCK_NPK_DATA = {
  nitrogen: { value: 140, optimal: { min: 120, max: 180 }, unit: 'ppm' },
  phosphorus: { value: 55, optimal: { min: 40, max: 80 }, unit: 'ppm' },
  potassium: { value: 210, optimal: { min: 180, max: 260 }, unit: 'ppm' },
};

export const MOCK_DEVICE_INFO = {
  firmwareVersion: 'v4.2.1',
  lastMaintenance: '2026-07-01T10:30:00Z',
  batteryLevel: 88,
  signalStrength: 92,
  uptime: '34 days, 8 hours',
  dataTransmitRate: '5s intervals',
  connectionProtocol: 'MQTT / TLS 1.3',
  hardwareModel: 'AgroSense Pro X4',
};
