/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit, addDoc, disableNetwork } from 'firebase/firestore';
import { getCachedTelemetry, setCachedTelemetry } from '../utils/dashboardCache';

const TelemetryContext = createContext(null);

// Initial seed data used only when the Firestore collection is empty on first launch
const createInitialSeedRecord = (sensorId = 'SENSOR-ZONE-A4') => ({
  sensorid: sensorId,
  typeofcrop: 'Romaine Lettuce',
  light_h: 16.5,
  temp_ty: 'Daytime Optimal',
  key_element: 'Nitrogen',
  crop_growth_st: 'Vegetative',
  moisture_pe: 72.4,
  temperature: 24.2,
  humidity_pe: 68.5,
  light_intensity: 850,
  soil_ph: 6.4,
  nitrogen_ra: 140,
  phosphorous_ra: 55,
  potassium_ra: 210,
  water_flow_l: 4.2,
  battery_status: 88,
  soil_fertility: 'Optimal',
  crop_health_st: 'Healthy',
  pest_occurrence: 'None',
  irrigation_efficiency: 94.2,
  yield_prediction: 480,
  actual_yield_kg: 465,
  crop_status: 'Active',
  soil_type: 'Clay Loam',
  plant_height: 18.5,
  soil_moisture: 68.1,
  device_status: 'Online',
  values_updated_at: new Date().toISOString(),
});

export const TelemetryProvider = ({ children }) => {
  const [activeSensorId, setActiveSensorId] = useState('SENSOR-ZONE-A4');

  // Synchronously initialize state from cache for instant (< 50ms) render
  const initialCache = getCachedTelemetry();
  const seedData = useMemo(() => createInitialSeedRecord(activeSensorId), [activeSensorId]);

  const [telemetry, setTelemetry] = useState(() => initialCache.telemetry || seedData);
  const [history, setHistory] = useState(() => (initialCache.history && initialCache.history.length > 0 ? initialCache.history : [seedData]));
  const [loading, setLoading] = useState(() => db ? !initialCache.telemetry : false);

  const saveTelemetry = useCallback(async (newData) => {
    if (!db) return;
    const dataWithTimestamp = {
      ...newData,
      values_updated_at: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, 'telemetry'), dataWithTimestamp);
    } catch (error) {
      console.warn('Error saving telemetry to Firestore:', error.message);
    }
  }, []);

  useEffect(() => {
    if (!db) {
      return;
    }

    try {
      const q = query(
        collection(db, 'telemetry'),
        orderBy('values_updated_at', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const records = [];
        snapshot.forEach((doc) => {
          records.push({ id: doc.id, ...doc.data() });
        });

        if (records.length > 0) {
          const latest = records[0];
          setTelemetry(latest);
          setHistory(records);
          setCachedTelemetry(latest, records);
          setLoading(false);
        } else {
          // Empty collection on first launch — seed an initial record
          saveTelemetry(seedData);
          setTelemetry(seedData);
          setHistory([seedData]);
          setCachedTelemetry(seedData, [seedData]);
          setLoading(false);
        }
      }, (error) => {
        console.warn('Firestore snapshot error in telemetry, disabling network retries:', error.message);
        if (db) disableNetwork(db).catch(() => { });
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Telemetry subscription error, disabling network retries:', err.message);
      if (db) disableNetwork(db).catch(() => { });
      queueMicrotask(() => setLoading(false));
    }
  }, [activeSensorId, saveTelemetry, seedData]);

  const value = useMemo(() => ({
    telemetry,
    history,
    activeSensorId,
    loading,
    setActiveSensorId,
    saveTelemetry,
  }), [telemetry, history, activeSensorId, loading, saveTelemetry]);

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};

