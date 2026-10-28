import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Settings, Plus, Play, Trash2 } from 'lucide-react';

const AutoRegulationRules = ({ rules, onRuleToggle, onAddRule, onDeleteRule }) => {
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: '',
    action: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRule.name || !newRule.trigger || !newRule.action) return;
    onAddRule(newRule);
    setNewRule({ name: '', trigger: '', action: '' });
    setShowAddRule(false);
  };

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Auto-Regulation Logic</h3>
            <p className="text-xs text-gray-400">Micro-controller automatic closed-loop rules</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddRule(!showAddRule)}
          className="flex items-center gap-1.5 text-xs font-bold text-black bg-[#00ff88] hover:bg-[#00e67a] px-3.5 py-2 rounded-lg transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,136,0.15)]"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Trigger
        </button>
      </div>

      {/* Add Rule Form */}
      {showAddRule && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[#0a0f1a] border border-slate-800 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Rule Name</label>
              <input
                type="text"
                required
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g. Low Humidity Fan Trigger"
                className="w-full bg-[#131c2e] border border-slate-800 rounded-lg text-xs text-white px-3 py-2 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">IF Conditional (Trigger)</label>
              <input
                type="text"
                required
                value={newRule.trigger}
                onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                placeholder="e.g. Humidity < 40%"
                className="w-full bg-[#131c2e] border border-slate-800 rounded-lg text-xs text-white px-3 py-2 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">THEN Command (Action)</label>
              <input
                type="text"
                required
                value={newRule.action}
                onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                placeholder="e.g. Turn Fan OFF"
                className="w-full bg-[#131c2e] border border-slate-800 rounded-lg text-xs text-white px-3 py-2 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setShowAddRule(false)}
              className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-bold text-black bg-[#00ff88] hover:bg-[#00e67a] px-4 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              Save Rule
            </button>
          </div>
        </form>
      )}

      {/* Rules list */}
      <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-3.5 border rounded-xl flex items-center justify-between transition-colors ${
              rule.status 
                ? 'bg-[#0a0f1a]/50 border-slate-800/80 hover:bg-[#0a0f1a]/80' 
                : 'bg-[#0a0f1a]/10 border-slate-800/40 opacity-50'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className={`p-2 rounded-lg border mt-0.5 w-9 h-9 flex items-center justify-center ${
                rule.status 
                  ? 'text-[#00ff88] bg-[#00ff88]/5 border-[#00ff88]/10' 
                  : 'text-gray-500 bg-[#0d1424] border-slate-800'
              }`}>
                <Play className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate leading-tight">{rule.name}</h4>
                <p className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                  <span className="font-mono text-amber-400">IF: {rule.trigger}</span>
                  <span className="text-gray-700">|</span>
                  <span className="font-mono text-emerald-400">THEN: {rule.action}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 flex-shrink-0 ml-4">
              <button
                onClick={() => onRuleToggle(rule.id)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {rule.status ? (
                  <ToggleRight className="w-8 h-8 text-[#00ff88]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => onDeleteRule(rule.id)}
                className="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg bg-[#131c2e] hover:bg-rose-500/10 border border-slate-800/80 hover:border-rose-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoRegulationRules;
