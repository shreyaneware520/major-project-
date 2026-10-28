import React, { useState } from 'react';
import {
  ControlHeader,
  ControlSelector,
  ActuatorGrid,
  AutoRegulationRules,
  OverrideLogs,
  INITIAL_ACTUATORS,
  INITIAL_RULES,
  INITIAL_OVERRIDE_LOGS,
} from '../../components/Controls';
import { MOCK_GROW_ROOMS } from '../../components/GrowRooms/growRoomData';

const Controls = () => {
  const [activeRoomId, setActiveRoomId] = useState(MOCK_GROW_ROOMS[0]?.id || 'GR-001');
  const [actuators, setActuators] = useState(INITIAL_ACTUATORS);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [logs, setLogs] = useState(INITIAL_OVERRIDE_LOGS);

  // Actuator Toggle
  const handleActuatorToggle = (id) => {
    setActuators(prev =>
      prev.map(act => {
        if (act.id === id) {
          const nextStatus = !act.status;
          
          // Log manual override action
          const newLog = {
            id: Date.now(),
            operator: 'Operator (You)',
            action: `Manually set ${act.name} to ${nextStatus ? 'ON' : 'OFF'}`,
            timestamp: 'Just now',
            ip: '192.168.1.15',
          };
          setLogs(prevLogs => [newLog, ...prevLogs]);

          return { 
            ...act, 
            status: nextStatus,
            value: nextStatus ? (act.type === 'light' ? 85 : act.type === 'pump' ? 4.2 : act.type === 'doser' ? 120 : act.type === 'humidifier' ? 65 : act.type === 'heater' ? 24 : 0) : 0
          };
        }
        return act;
      })
    );
  };

  // Actuator Value Change (sliders)
  const handleActuatorValueChange = (id, newVal) => {
    setActuators(prev =>
      prev.map(act => {
        if (act.id === id) {
          return { ...act, value: newVal };
        }
        return act;
      })
    );
  };

  // Actuator Mode Toggle (Auto / Manual)
  const handleActuatorModeToggle = (id) => {
    setActuators(prev =>
      prev.map(act => {
        if (act.id === id) {
          const nextMode = act.mode === 'auto' ? 'manual' : 'auto';
          return { ...act, mode: nextMode };
        }
        return act;
      })
    );
  };

  // Rule Toggle Status
  const handleRuleToggle = (id) => {
    setRules(prev =>
      prev.map(r => {
        if (r.id === id) {
          return { ...r, status: !r.status };
        }
        return r;
      })
    );
  };

  // Add Rule
  const handleAddRule = (newRule) => {
    const ruleItem = {
      id: `rule-${Date.now()}`,
      status: true,
      ...newRule,
    };
    setRules(prev => [...prev, ruleItem]);
  };

  // Delete Rule
  const handleDeleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  return (
    <main className="p-6 md:p-8 space-y-8 flex-1">
          {/* Controls Header */}
          <ControlHeader />

          {/* Active Grow Room Selector */}
          <ControlSelector activeRoomId={activeRoomId} onRoomChange={setActiveRoomId} />

          {/* Actuator control switches & sliders */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide">Actuator Swarm</h3>
            <ActuatorGrid
              actuators={actuators}
              onToggle={handleActuatorToggle}
              onValueChange={handleActuatorValueChange}
              onModeToggle={handleActuatorModeToggle}
            />
          </div>

          {/* Auto-regulation automation rules & command logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AutoRegulationRules
              rules={rules}
              onRuleToggle={handleRuleToggle}
              onAddRule={handleAddRule}
              onDeleteRule={handleDeleteRule}
            />
            <OverrideLogs logs={logs} />
          </div>
    </main>
  );
};

export default Controls;
