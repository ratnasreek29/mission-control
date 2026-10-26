import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit3, Save, X, Target, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTone } from '../utils/sound';

export default function DailyMissions({ missions, setMissions }) {
  const [filter, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // New Mission form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('College');
  const [priority, setPriority] = useState('High');
  const [deadline, setDeadline] = useState('');

  // Editing state inputs
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('High');
  const [editDeadline, setEditDeadline] = useState('');

  // Trigger Cyber Victory Confetti
  const fireConfetti = () => {
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#059669'],
      disableForReducedMotion: true
    });
  };

  const handleToggle = (id) => {
    const target = missions.find(m => m.id === id);
    const willBeCompleted = target ? !target.completed : false;

    setMissions(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m))
    );

    if (willBeCompleted) {
      playTone(720, 'sine', 0.2);
      fireConfetti();
    } else {
      playTone(320, 'sine', 0.15);
    }
  };

  const handleDelete = (id) => {
    setMissions(prev => prev.filter(m => m.id !== id));
    playTone(220, 'sawtooth', 0.15);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMission = {
      id: `m-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      deadline,
      completed: false,
      createdAt: Date.now()
    };

    setMissions([newMission, ...missions]);
    setTitle('');
    setDeadline('');
    setIsAdding(false);
    playTone(600, 'triangle', 0.2);
  };

  const startEditing = (m) => {
    setEditingId(m.id);
    setEditTitle(m.title);
    setEditPriority(m.priority);
    setEditDeadline(m.deadline || '');
  };

  const saveEdit = (id) => {
    setMissions(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, title: editTitle, priority: editPriority, deadline: editDeadline }
          : m
      )
    );
    setEditingId(null);
    playTone(550, 'sine', 0.15);
  };

  const filteredMissions = missions.filter(m => {
    if (filter === 'All') return true;
    return m.category.toLowerCase() === filter.toLowerCase();
  });

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return 'text-rose-400 bg-rose-950/40 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.25)]';
      case 'High':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
      default:
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#0c1216]/90 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold font-mono tracking-wider uppercase text-emerald-400 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span>DAILY MISSIONS</span>
            <span className="text-xs bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              {missions.filter(m => !m.completed).length} ACTIVE
            </span>
          </h2>
          <p className="text-xs text-slate-400">Tactical objectives scheduled for this 24-hour cycle.</p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Category Filters */}
          <div className="flex bg-[#06090c] p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {['All', 'College', 'Coding', 'Personal'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md transition ${
                  filter === f
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold uppercase rounded-lg transition shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
          >
            {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAdding ? 'Cancel' : 'New Mission'}</span>
          </button>
        </div>
      </div>

      {/* Add Mission Form Drawer */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-[#06090c] p-4 rounded-xl border border-emerald-500/40 space-y-3 animate-fadeIn">
          <div className="text-xs font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>INITIALIZE NEW OBJECTIVE DIRECTIVE</span>
          </div>

          <input
            type="text"
            required
            placeholder="Mission designation (e.g. Implement Dijkstra Algorithm)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Sector / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="College">College</option>
                <option value="Coding">Coding</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Priority Matrix</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Critical">Critical (Immediate Focus)</option>
                <option value="High">High Priority</option>
                <option value="Routine">Routine Objective</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Deadline</label>
              <input
                type="text"
                placeholder="e.g. 18:00 or Today"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase rounded-lg transition"
          >
            Deploy Mission to Protocol
          </button>
        </form>
      )}

      {/* Mission List with Cyber Glowing Cards */}
      <div className="space-y-2.5">
        {filteredMissions.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
            NO ACTIVE MISSIONS IN THIS SECTOR
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isEditing = editingId === mission.id;

            return (
              <div
                key={mission.id}
                className={`cyber-card flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                  mission.completed
                    ? 'bg-[#06090c]/50 border-slate-900/60 opacity-60'
                    : 'bg-[#090f13] border-slate-800'
                }`}
              >
                {/* Left: Checkbox + Title */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggle(mission.id)}
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      mission.completed
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : 'border-slate-700 hover:border-emerald-500 bg-[#06090c]'
                    }`}
                  >
                    {mission.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-[#06090c] border border-emerald-500 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="bg-[#06090c] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                          >
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Routine">Routine</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Deadline"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="bg-[#06090c] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span
                          className={`text-sm ${
                            mission.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'
                          }`}
                        >
                          {mission.title}
                        </span>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-mono uppercase bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded border border-slate-700/60">
                            {mission.category}
                          </span>

                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border badge-glow ${getPriorityBadge(mission.priority)}`}>
                            {mission.priority}
                          </span>

                          {mission.deadline && (
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <span>Due:</span>
                              <span className="text-slate-300">{mission.deadline}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  {isEditing ? (
                    <button
                      onClick={() => saveEdit(mission.id)}
                      className="p-1.5 hover:text-emerald-400 text-slate-400 transition"
                      title="Save Revisions"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(mission)}
                      className="p-1.5 hover:text-emerald-400 text-slate-500 hover:scale-110 transition"
                      title="Edit Mission"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(mission.id)}
                    className="p-1.5 hover:text-rose-400 text-slate-500 hover:scale-110 transition"
                    title="Delete Directive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
