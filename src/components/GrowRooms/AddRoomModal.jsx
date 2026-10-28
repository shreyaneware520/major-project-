import React, { useState, useCallback } from 'react';
import {
  Sprout, X, ChevronLeft, ChevronRight, Check,
  Tag, Leaf, Thermometer,
  Cpu, Zap, LayoutGrid,
  FileText, Settings2, Activity, AlertTriangle,
} from 'lucide-react';

// ─── Section Tab config ────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'room',       label: 'Room Info',    icon: Tag },
  { id: 'crop',       label: 'Crop Config',  icon: Leaf },
  { id: 'env',        label: 'Environment',  icon: Thermometer },
  { id: 'sensor',     label: 'Sensors',      icon: Cpu },
  { id: 'automation', label: 'Automation',   icon: Zap },
  { id: 'review',     label: 'Review & Submit', icon: Check },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
const generateRoomCode = (name) => {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  const prefix = words.map(w => w[0]?.toUpperCase() ?? '').join('').substring(0, 3) || 'GR';
  const num = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix}-${num}`;
};

const calcHarvestDate = (cycleDays) => {
  if (!cycleDays || isNaN(Number(cycleDays))) return '';
  const d = new Date();
  d.setDate(d.getDate() + Number(cycleDays));
  return d.toISOString().split('T')[0];
};

// ─── Reusable form primitives ───────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
    {children}{required && <span className="text-[#00ff88] ml-0.5">*</span>}
  </label>
);

const HelperText = ({ children }) => (
  <p className="text-[10px] text-gray-500 mt-1 leading-snug">{children}</p>
);

const InputField = ({ label, required, helper, unit, error, ...props }) => (
  <div>
    {label && <Label required={required}>{label}</Label>}
    <div className="relative">
      <input
        {...props}
        className={`w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-600 px-4 py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-1 ${
          error
            ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-800 focus:border-[#00ff88] focus:ring-[#00ff88]/20'
        } ${unit ? 'pr-14' : ''}`}
      />
      {unit && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold pointer-events-none">
          {unit}
        </span>
      )}
    </div>
    {helper && !error && <HelperText>{helper}</HelperText>}
    {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, required, helper, options, error, ...props }) => (
  <div>
    {label && <Label required={required}>{label}</Label>}
    <select
      {...props}
      className={`w-full bg-[#0a0f1a] text-sm text-white px-4 py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-1 appearance-none cursor-pointer ${
        error
          ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-slate-800 focus:border-[#00ff88] focus:ring-[#00ff88]/20'
      }`}
    >
      <option value="">Select…</option>
      {options.map(o =>
        typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
    {helper && !error && <HelperText>{helper}</HelperText>}
    {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
  </div>
);

const SectionTitle = ({ icon: Icon, label, accent }) => (
  <div className={`flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-800/70`}>
    <div className={`p-2 rounded-lg ${accent ?? 'bg-[#00ff88]/10 text-[#00ff88]'} border border-current/20`}>
      <Icon className="w-4 h-4" />
    </div>
    <h4 className="text-sm font-bold text-white tracking-wide">{label}</h4>
  </div>
);

const ToggleSwitch = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-200">{label}</p>
      {description && <p className="text-[10px] text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 border focus:outline-none ${
        checked
          ? 'bg-[#00ff88]/20 border-[#00ff88]/50'
          : 'bg-slate-800 border-slate-700'
      }`}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-200 shadow-sm ${
          checked ? 'translate-x-5 bg-[#00ff88]' : 'translate-x-0 bg-slate-500'
        }`}
      />
    </button>
  </div>
);

const RangeRow = ({ label, minKey, maxKey, unit, helper, form, onChange, errors }) => (
  <div>
    <Label>{label}</Label>
    <div className="grid grid-cols-2 gap-3">
      <div className="relative">
        <input
          type="number"
          placeholder="Min"
          value={form[minKey]}
          onChange={e => onChange(minKey, e.target.value)}
          className={`w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-600 px-4 py-2.5 pr-12 rounded-xl border transition-all focus:outline-none focus:ring-1 ${
            errors[minKey] ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-[#00ff88] focus:ring-[#00ff88]/20'
          }`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold pointer-events-none">{unit}</span>
      </div>
      <div className="relative">
        <input
          type="number"
          placeholder="Max"
          value={form[maxKey]}
          onChange={e => onChange(maxKey, e.target.value)}
          className={`w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-600 px-4 py-2.5 pr-12 rounded-xl border transition-all focus:outline-none focus:ring-1 ${
            errors[maxKey] ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-[#00ff88] focus:ring-[#00ff88]/20'
          }`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold pointer-events-none">{unit}</span>
      </div>
    </div>
    {helper && <HelperText>{helper}</HelperText>}
    {(errors[minKey] || errors[maxKey]) && (
      <p className="text-[10px] text-rose-400 mt-1">Temperature min & max are required.</p>
    )}
  </div>
);

// ─── Default form state ────────────────────────────────────────────────────
const DEFAULT_FORM = {
  // Section 1 — Room Info
  name: '', roomCode: '', crop: '', cropVariety: '',
  roomType: '', growingMethod: '', zone: '', description: '',
  // Section 2 — Crop Config
  plantCount: '', expectedHarvestQty: '', harvestUnit: 'kg',
  growthStage: '', cropCycleDays: '', expectedHarvestDate: '',
  // Section 3 — Environment
  tempMin: '', tempMax: '', humidityMin: '', humidityMax: '',
  soilMoisture: '', targetEC: '', targetPH: '', targetCO2: '',
  lightIntensity: '', photoperiod: '',
  // Section 4 — Sensor
  sensorId: '', controllerId: '', esp32Id: '', gatewayId: '',
  deviceStatus: 'Pending', connectionType: 'WiFi', mqttTopic: '',
  // Section 5 — Automation
  automationEnabled: false, autoIrrigation: false,
  autoVentilation: false, autoLighting: false,
  autoNutrientDosing: false, emergencyMode: false,
  // Section 6 — Capacity
  roomArea: '', numRacks: '', plantsPerRack: '',
  waterTankCapacity: '', nutrientTankCapacity: '',
  // Section 7 — Notes
  operatorNotes: '', maintenanceNotes: '', specialInstructions: '',
};

// ─── Validation ────────────────────────────────────────────────────────────
const validateSection = (sectionId, form) => {
  const errs = {};
  if (sectionId === 'room') {
    if (!form.name.trim())        errs.name     = 'Room name is required.';
    if (!form.crop.trim())        errs.crop     = 'Crop name is required.';
    if (!form.roomType)           errs.roomType = 'Room type is required.';
    if (!form.zone.trim())        errs.zone     = 'Zone is required.';
  }
  if (sectionId === 'env') {
    if (!form.tempMin)            errs.tempMin    = 'Required';
    if (!form.tempMax)            errs.tempMax    = 'Required';
    if (!form.humidityMin)        errs.humidityMin = 'Required';
    if (!form.humidityMax)        errs.humidityMax = 'Required';
  }
  if (sectionId === 'sensor') {
    if (!form.sensorId.trim())    errs.sensorId = 'Sensor ID is required.';
  }
  return errs;
};

const validateAll = (form) => ({
  ...validateSection('room', form),
  ...validateSection('env', form),
  ...validateSection('sensor', form),
});

// ─── Main Modal Component ──────────────────────────────────────────────────
const AddRoomModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // Reset state when modal opens
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setForm(DEFAULT_FORM);
    setErrors({});
    setTouched({});
    setActiveSection(0);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleChange = useCallback((key, value) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !touched.roomCode) {
        next.roomCode = generateRoomCode(value);
      }
      if (key === 'cropCycleDays' && !touched.expectedHarvestDate) {
        next.expectedHarvestDate = calcHarvestDate(value);
      }
      return next;
    });
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  }, [touched.roomCode, touched.expectedHarvestDate]);

  const handleBlur = useCallback((key) => {
    setTouched(prev => ({ ...prev, [key]: true }));
  }, []);

  const allErrors = validateAll(form);
  const isFormValid = Object.keys(allErrors).length === 0;

  const goToSection = (idx) => {
    setActiveSection(idx);
  };

  const handleNext = () => {
    const sId = SECTIONS[activeSection].id;
    const sectionErrors = validateSection(sId, form);
    if (Object.keys(sectionErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...sectionErrors }));
      const firstKey = Object.keys(sectionErrors)[0];
      setTouched(prev => ({ ...prev, [firstKey]: true }));
      return;
    }
    setActiveSection(i => Math.min(i + 1, SECTIONS.length - 1));
  };

  const handleBack = () => setActiveSection(i => Math.max(i - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrs = validateAll(form);
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      // Jump to the first section with an error
      const errKeys = Object.keys(allErrs);
      const sectionOrder = ['room', 'crop', 'env', 'sensor', 'automation', 'capacity', 'notes'];
      for (let i = 0; i < sectionOrder.length; i++) {
        const sid = sectionOrder[i];
        const secErrs = validateSection(sid, form);
        if (Object.keys(secErrs).length > 0) {
          setActiveSection(SECTIONS.findIndex(s => s.id === sid));
          break;
        }
      }
      errKeys.forEach(k => setTouched(prev => ({ ...prev, [k]: true })));
      return;
    }
    setSubmitting(true);
    // Simulated async save — replace with Firestore call
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const section = SECTIONS[activeSection];
  const isLastSection = activeSection === SECTIONS.length - 1;
  const isFirstSection = activeSection === 0;

  // Sections with known validation errors (for tab indicator)
  const sectionHasError = (sid) => Object.keys(validateSection(sid, form)).some(k => touched[k]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="bg-[#0d1424] border border-slate-800 rounded-3xl w-full max-w-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden relative flex flex-col"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* ── Modal Header ─────────────────────────────────────────────── */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Add New Grow Room</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Configure your greenhouse facility room</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 bg-[#131c2e] hover:bg-[#1b2740] rounded-xl transition-all border border-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Section Tab Strip ─────────────────────────────────────────── */}
        <div className="border-b border-slate-800/80 px-6 pt-4 shrink-0 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === activeSection;
              const hasErr = sectionHasError(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSection(i)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-semibold rounded-t-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#131c2e] text-[#00ff88] border border-slate-800 border-b-[#131c2e] -mb-px'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {hasErr
                    ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    : <Icon className="w-3.5 h-3.5" />
                  }
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Scrollable Form Body ──────────────────────────────────────── */}
        <form id="add-room-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">

            {/* ── SECTION 1: Room Information ─────────────────────────── */}
            {section.id === 'room' && (
              <div className="space-y-5">
                <SectionTitle icon={Tag} label="Room Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Room Name"
                    required
                    placeholder="e.g., Hydroponics Alpha"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    error={touched.name ? errors.name : ''}
                  />
                  <InputField
                    label="Room Code"
                    placeholder="e.g., GR-001"
                    value={form.roomCode}
                    onChange={e => { handleChange('roomCode', e.target.value); setTouched(p => ({ ...p, roomCode: true })); }}
                    helper="Auto-generated from room name — editable"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Crop Name"
                    required
                    placeholder="e.g., Romaine Lettuce"
                    value={form.crop}
                    onChange={e => handleChange('crop', e.target.value)}
                    onBlur={() => handleBlur('crop')}
                    error={touched.crop ? errors.crop : ''}
                  />
                  <InputField
                    label="Crop Variety"
                    placeholder="e.g., Paris Island Cos"
                    value={form.cropVariety}
                    onChange={e => handleChange('cropVariety', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SelectField
                    label="Room Type"
                    required
                    value={form.roomType}
                    onChange={e => { handleChange('roomType', e.target.value); handleBlur('roomType'); }}
                    options={['Hydroponic', 'Vertical Farm', 'Greenhouse', 'NFT', 'DWC', 'Aeroponic', 'Drip System']}
                    error={touched.roomType ? errors.roomType : ''}
                  />
                  <SelectField
                    label="Growing Method"
                    value={form.growingMethod}
                    onChange={e => handleChange('growingMethod', e.target.value)}
                    options={['Indoor', 'Semi Indoor', 'Outdoor']}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Zone"
                    required
                    placeholder="e.g., Zone A"
                    value={form.zone}
                    onChange={e => handleChange('zone', e.target.value)}
                    onBlur={() => handleBlur('zone')}
                    error={touched.zone ? errors.zone : ''}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of this grow room's purpose or configuration…"
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className="w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-600 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* ── SECTION 2: Crop Configuration ───────────────────────── */}
            {section.id === 'crop' && (
              <div className="space-y-5">
                <SectionTitle icon={Leaf} label="Crop Configuration" accent="bg-emerald-500/10 text-emerald-400" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <InputField
                    label="Plant Count"
                    type="number"
                    placeholder="e.g., 200"
                    value={form.plantCount}
                    onChange={e => handleChange('plantCount', e.target.value)}
                  />
                  <InputField
                    label="Expected Harvest Qty"
                    type="number"
                    placeholder="e.g., 480"
                    value={form.expectedHarvestQty}
                    onChange={e => handleChange('expectedHarvestQty', e.target.value)}
                  />
                  <SelectField
                    label="Harvest Unit"
                    value={form.harvestUnit}
                    onChange={e => handleChange('harvestUnit', e.target.value)}
                    options={['kg', 'tons', 'pieces', 'lbs', 'g']}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SelectField
                    label="Growth Stage"
                    value={form.growthStage}
                    onChange={e => handleChange('growthStage', e.target.value)}
                    options={['Seed', 'Seedling', 'Vegetative', 'Flowering', 'Harvest Ready']}
                  />
                  <InputField
                    label="Crop Cycle"
                    type="number"
                    placeholder="e.g., 45"
                    unit="days"
                    value={form.cropCycleDays}
                    onChange={e => handleChange('cropCycleDays', e.target.value)}
                    helper="Enter duration in days to auto-calculate harvest date"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Expected Harvest Date"
                    type="date"
                    value={form.expectedHarvestDate}
                    onChange={e => { handleChange('expectedHarvestDate', e.target.value); setTouched(p => ({ ...p, expectedHarvestDate: true })); }}
                    helper="Auto-calculated from crop cycle — or set manually"
                  />
                </div>
              </div>
            )}

            {/* ── SECTION 3: Environment ───────────────────────────────── */}
            {section.id === 'env' && (
              <div className="space-y-5">
                <SectionTitle icon={Thermometer} label="Environment Configuration" accent="bg-amber-500/10 text-amber-400" />
                <RangeRow
                  label="Target Temperature *"
                  minKey="tempMin" maxKey="tempMax"
                  unit="°C"
                  helper="Recommended: 22–28 °C for most hydroponic crops"
                  form={form} onChange={handleChange} errors={touched.tempMin || touched.tempMax ? errors : {}}
                />
                <RangeRow
                  label="Target Humidity *"
                  minKey="humidityMin" maxKey="humidityMax"
                  unit="%"
                  helper="Recommended: 55–75% relative humidity"
                  form={form} onChange={handleChange} errors={touched.humidityMin || touched.humidityMax ? errors : {}}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Target Soil Moisture"
                    type="number"
                    placeholder="e.g., 68"
                    unit="%"
                    value={form.soilMoisture}
                    onChange={e => handleChange('soilMoisture', e.target.value)}
                    helper="Recommended: 60–75%"
                  />
                  <InputField
                    label="Target EC (Electrical Conductivity)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.4"
                    unit="mS/cm"
                    value={form.targetEC}
                    onChange={e => handleChange('targetEC', e.target.value)}
                    helper="Recommended: 1.5–3.5 mS/cm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Target pH"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 6.2"
                    value={form.targetPH}
                    onChange={e => handleChange('targetPH', e.target.value)}
                    helper="Recommended: 5.5–6.5"
                  />
                  <InputField
                    label="Target CO₂"
                    type="number"
                    placeholder="e.g., 1200"
                    unit="ppm"
                    value={form.targetCO2}
                    onChange={e => handleChange('targetCO2', e.target.value)}
                    helper="Ambient is ~400 ppm; enriched: 800–1500 ppm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Target Light Intensity"
                    type="number"
                    placeholder="e.g., 850"
                    unit="Lux"
                    value={form.lightIntensity}
                    onChange={e => handleChange('lightIntensity', e.target.value)}
                    helper="Recommended: 600–1200 Lux for leafy crops"
                  />
                  <InputField
                    label="Photoperiod"
                    type="number"
                    step="0.5"
                    placeholder="e.g., 16"
                    unit="hrs/day"
                    value={form.photoperiod}
                    onChange={e => handleChange('photoperiod', e.target.value)}
                    helper="Recommended: 14–18 hrs for vegetative stage"
                  />
                </div>
              </div>
            )}

            {/* ── SECTION 4: Sensor Configuration ─────────────────────── */}
            {section.id === 'sensor' && (
              <div className="space-y-5">
                <SectionTitle icon={Cpu} label="Sensor Configuration" accent="bg-blue-500/10 text-blue-400" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Sensor ID"
                    required
                    placeholder="e.g., SENSOR-ZONE-A4"
                    value={form.sensorId}
                    onChange={e => handleChange('sensorId', e.target.value)}
                    onBlur={() => handleBlur('sensorId')}
                    error={touched.sensorId ? errors.sensorId : ''}
                  />
                  <InputField
                    label="Controller ID"
                    placeholder="e.g., CTRL-A4-01"
                    value={form.controllerId}
                    onChange={e => handleChange('controllerId', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="ESP32 ID"
                    placeholder="e.g., ESP32-A4F2"
                    value={form.esp32Id}
                    onChange={e => handleChange('esp32Id', e.target.value)}
                  />
                  <InputField
                    label="Gateway ID"
                    placeholder="e.g., GW-FACILITY-04"
                    value={form.gatewayId}
                    onChange={e => handleChange('gatewayId', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SelectField
                    label="Device Status"
                    value={form.deviceStatus}
                    onChange={e => handleChange('deviceStatus', e.target.value)}
                    options={['Connected', 'Pending', 'Offline']}
                  />
                  <SelectField
                    label="Connection Type"
                    value={form.connectionType}
                    onChange={e => handleChange('connectionType', e.target.value)}
                    options={['WiFi', 'Ethernet', 'LoRa', 'Zigbee', 'Bluetooth']}
                  />
                </div>
                <InputField
                  label="MQTT Topic"
                  placeholder="e.g., facility/zone-a/sensor-a4/telemetry"
                  value={form.mqttTopic}
                  onChange={e => handleChange('mqttTopic', e.target.value)}
                  helper="Optional — required only for custom MQTT broker integrations"
                />
                <div className="bg-[#131c2e] border border-slate-800/60 rounded-xl p-4 flex items-start gap-3">
                  <Zap className="w-4 h-4 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-300 font-semibold">Auto-Configuration</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      The room will automatically connect to its assigned sensor and begin telemetry streaming within 60 seconds of creation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── SECTION 5: Automation ────────────────────────────────── */}
            {section.id === 'automation' && (
              <div className="space-y-2">
                <SectionTitle icon={Settings2} label="Automation Settings" accent="bg-purple-500/10 text-purple-400" />
                <div className="bg-[#131c2e] border border-slate-800/60 rounded-2xl px-5 py-2">
                  <ToggleSwitch
                    label="Automation Enabled"
                    description="Master switch for all automated operations in this room"
                    checked={form.automationEnabled}
                    onChange={v => handleChange('automationEnabled', v)}
                  />
                  <ToggleSwitch
                    label="Auto Irrigation"
                    description="Automatically trigger irrigation based on soil moisture targets"
                    checked={form.autoIrrigation}
                    onChange={v => handleChange('autoIrrigation', v)}
                  />
                  <ToggleSwitch
                    label="Auto Ventilation"
                    description="Regulate airflow to maintain target temperature and CO₂ levels"
                    checked={form.autoVentilation}
                    onChange={v => handleChange('autoVentilation', v)}
                  />
                  <ToggleSwitch
                    label="Auto Lighting"
                    description="Control grow lights according to configured photoperiod schedule"
                    checked={form.autoLighting}
                    onChange={v => handleChange('autoLighting', v)}
                  />
                  <ToggleSwitch
                    label="Auto Nutrient Dosing"
                    description="Automatic EC and pH adjustment based on sensor feedback"
                    checked={form.autoNutrientDosing}
                    onChange={v => handleChange('autoNutrientDosing', v)}
                  />
                  <ToggleSwitch
                    label="Emergency Mode"
                    description="Activates safety overrides and alerts when critical thresholds are breached"
                    checked={form.emergencyMode}
                    onChange={v => handleChange('emergencyMode', v)}
                  />
                </div>
              </div>
            )}

            {/* ── SECTION 6: Capacity ──────────────────────────────────── */}
            {section.id === 'capacity' && (
              <div className="space-y-5">
                <SectionTitle icon={LayoutGrid} label="Room Capacity" accent="bg-cyan-500/10 text-cyan-400" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Room Area"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 48"
                    unit="sqm"
                    value={form.roomArea}
                    onChange={e => handleChange('roomArea', e.target.value)}
                  />
                  <InputField
                    label="Number of Racks"
                    type="number"
                    placeholder="e.g., 12"
                    value={form.numRacks}
                    onChange={e => handleChange('numRacks', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Plants Per Rack"
                    type="number"
                    placeholder="e.g., 24"
                    value={form.plantsPerRack}
                    onChange={e => handleChange('plantsPerRack', e.target.value)}
                  />
                  <div className="bg-[#131c2e] border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
                    <Activity className="w-4 h-4 text-[#00ff88] shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Capacity</p>
                      <p className="text-lg font-bold text-white mt-0.5">
                        {form.numRacks && form.plantsPerRack
                          ? (Number(form.numRacks) * Number(form.plantsPerRack)).toLocaleString()
                          : '—'
                        }
                        <span className="text-sm text-gray-400 font-normal ml-1">plants</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Water Tank Capacity"
                    type="number"
                    placeholder="e.g., 500"
                    unit="L"
                    value={form.waterTankCapacity}
                    onChange={e => handleChange('waterTankCapacity', e.target.value)}
                  />
                  <InputField
                    label="Nutrient Tank Capacity"
                    type="number"
                    placeholder="e.g., 200"
                    unit="L"
                    value={form.nutrientTankCapacity}
                    onChange={e => handleChange('nutrientTankCapacity', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── SECTION 7: Notes ─────────────────────────────────────── */}
            {section.id === 'notes' && (
              <div className="space-y-5">
                <SectionTitle icon={FileText} label="Operator Notes" accent="bg-slate-500/20 text-gray-300" />
                <div>
                  <Label>Operator Notes</Label>
                  <textarea
                    rows={4}
                    placeholder="Observations, reminders, or general operational notes…"
                    value={form.operatorNotes}
                    onChange={e => handleChange('operatorNotes', e.target.value)}
                    className="w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-600 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all resize-none"
                  />
                </div>
                <div>
                  <Label>Maintenance Notes</Label>
                  <textarea
                    rows={3}
                    placeholder="Scheduled maintenance tasks, equipment calibration intervals…"
                    value={form.maintenanceNotes}
                    onChange={e => handleChange('maintenanceNotes', e.target.value)}
                    className="w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-600 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all resize-none"
                  />
                </div>
                <div>
                  <Label>Special Instructions</Label>
                  <textarea
                    rows={3}
                    placeholder="Non-standard protocols, safety guidelines, or regulatory requirements…"
                    value={form.specialInstructions}
                    onChange={e => handleChange('specialInstructions', e.target.value)}
                    className="w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-600 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all resize-none"
                  />
                </div>
              </div>
            )}

          </div>
        </form>

        {/* ── Sticky Footer ─────────────────────────────────────────────── */}
        <div className="border-t border-slate-800/80 px-6 py-4 flex items-center justify-between gap-4 bg-[#0a0f1a]/40 shrink-0">
          {/* Left: Cancel / Back */}
          <div className="flex items-center gap-3">
            {isFirstSection ? (
              <button
                type="button"
                onClick={onClose}
                className="bg-[#131c2e] hover:bg-[#1b2740] border border-slate-800 hover:border-slate-700 text-gray-300 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 bg-[#131c2e] hover:bg-[#1b2740] border border-slate-800 hover:border-slate-700 text-gray-300 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>

          {/* Center: Step indicator */}
          <div className="flex items-center gap-1.5">
            {SECTIONS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSection(i)}
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  i === activeSection
                    ? 'w-5 h-2 bg-[#00ff88]'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Right: Next / Create Room */}
          {isLastSection ? (
            <button
              type="submit"
              form="add-room-form"
              disabled={submitting}
              className={`flex items-center gap-2 font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                isFormValid && !submitting
                  ? 'bg-[#00ff88] hover:bg-[#00e67a] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]'
                  : 'bg-[#00ff88]/40 text-black/60 cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Room
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,136,0.25)] cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
