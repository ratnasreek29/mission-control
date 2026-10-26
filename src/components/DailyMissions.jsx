import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit3, X, Filter } from 'lucide-react';
import { playTone } from '../utils/sound';

export default function DailyMissions({ missions, setMissions }) {
  const [filter, setFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('College');
  const [formPriority, setFormPriority] = useState('High');
  const [formDeadline, setFormDeadline] = useState('');

  const openNewForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCategory('College');
    setFormPriority('High');
    setFormDeadline('');
    setIsFormOpen(true);
  };

  const openEditForm = (mission) => {
    setEditingId(mission.id);
    setFormTitle(mission.title);
    setFormCategory(mission.category);
    setFormPriority(mission.priority);
    setFormDeadline(mission.deadline || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingId) {
      setMissions((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? { ...m, title: formTitle.trim(), category: formCategory, priority: formPriority, deadline: formDeadline.trim() }
            : m
        )
      );
    } else {
      const newMission = {
        id: 'mission-' + Date.now(),
        title: formTitle.trim(),
        category: formCategory,
        priority: formPriority,
        deadline: formDeadline.trim(),
        completed: false,
        createdAt: Date.now()
      };
      setMissions((prev) => [newMission, ...prev]);
      playTone(600, 'triangle', 0.15);
    }

    setIsFormOpen(false);
  };

  const toggleMission = (id) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.completed;
          if (nextState) playTone(980, 'sine', 0.2);
          return { ...m, completed: nextState };
        }
        return m;
      })
    );
  };

  const deleteMission = (id) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    playTone(320, 'square', 0.15);
  };

  const filteredMissions = missions.filter((m) => {
    if (filter === 'All') return true;
    return m.category === filter;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-400 border-red-500/40 bg-red-950/30';
      case 'High':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
      default:
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'College':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20';
      case 'Coding':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
      default:
        return 'text-purple-400 border-purple-500/30 bg-purple-950/20';
    }
  };

  return (
    <div className="bg-[#0c1216] border border-slate-800 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold font-mono tracking-wider uppercase text-emerald-400 flex items-center gap-2">
            <span>DAILY MISSIONS</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              {filteredMissions.length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-400">Tactical objectives scheduled for this 24-hour cycle.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-[#06090c] border border-slate-800 rounded-lg p-1">
            {['All', 'College', 'Coding', 'Personal'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition ${
                  filter === cat
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={openNewForm}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Mission</span>
          </button>
        </div>
      </div>

      {/* Mission Creation/Edit Modal Drawer */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-[#06090c] border border-emerald-500/40 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
              {editingId ? 'Edit Mission Parameters' : 'Deploy New Mission Directive'}
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Mission Objective *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Implement Dijkstra algorithm in Python"
                className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="College">College</option>
                  <option value="Coding">Coding</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Priority</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Routine">Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Target Deadline</label>
                <input
                  type="text"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  placeholder="e.g. 18:00 or Today"
                  className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase rounded"
            >
              {editingId ? 'Save Revisions' : 'Initialize Mission'}
            </button>
          </div>
        </form>
      )}

      {/* Mission List */}
      <div className="space-y-2">
        {filteredMissions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-lg bg-[#06090c]">
            <p className="text-slate-500 font-mono text-sm">No missions active in this sector.</p>
            <button
              onClick={openNewForm}
              className="mt-3 text-xs text-emerald-400 font-mono underline hover:text-emerald-300"
            >
              + Create your first mission
            </button>
          </div>
        ) : (
          filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                mission.completed
                  ? 'bg-[#06090c]/60 border-slate-900 opacity-60'
                  : 'bg-[#06090c] border-slate-800/90 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <button
                  onClick={() => toggleMission(mission.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                    mission.completed
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-600 hover:border-emerald-400'
                  }`}
                >
                  {mission.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <div className={`text-sm font-medium truncate ${mission.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                    {mission.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${getCategoryStyle(mission.category)}`}>
                      {mission.category}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${getPriorityStyle(mission.priority)}`}>
                      {mission.priority}
                    </span>
                    {mission.deadline && (
                      <span className="text-[11px] font-mono text-slate-400">
                        Due: {mission.deadline}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openEditForm(mission)}
                  title="Edit Mission"
                  className="p-1.5 text-slate-400 hover:text-emerald-400 transition"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMission(mission.id)}
                  title="Purge Mission"
                  className="p-1.5 text-slate-400 hover:text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
