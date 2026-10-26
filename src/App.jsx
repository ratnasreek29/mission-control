import React, { useState, useEffect } from 'react';
import { Compass, Download, Upload } from 'lucide-react';
import DailyBriefing from './components/DailyBriefing';
import DailyMissions from './components/DailyMissions';
import FocusChamber from './components/FocusChamber';
import StudyPlanner from './components/StudyPlanner';

const INITIAL_MISSIONS = [
  { id: 'm-1', title: 'Implement Binary Search Tree deletion algorithm', category: 'Coding', priority: 'Critical', deadline: '23:59', completed: false, createdAt: Date.now() },
  { id: 'm-2', title: 'Review Physics II thermodynamics notes', category: 'College', priority: 'High', deadline: '18:00', completed: false, createdAt: Date.now() },
  { id: 'm-3', title: 'Meal prep high-protein lunch', category: 'Personal', priority: 'Routine', deadline: '', completed: true, createdAt: Date.now() }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Persistent States
  const [missions, setMissions] = useState(() => {
    try {
      const saved = localStorage.getItem('mc_missions');
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch { return INITIAL_MISSIONS; }
  });

  const [sessionsCount, setSessionsCount] = useState(() => {
    try {
      const s = localStorage.getItem('mc_sessions_count');
      return s ? parseInt(s, 10) : 0;
    } catch { return 0; }
  });

  const [focusedMinutes, setFocusedMinutes] = useState(() => {
    try {
      const m = localStorage.getItem('mc_focused_minutes');
      return m ? parseInt(m, 10) : 0;
    } catch { return 0; }
  });

  const [currentPlan, setCurrentPlan] = useState(() => {
    try {
      const p = localStorage.getItem('mc_plan');
      return p ? JSON.parse(p) : {
        subject: 'Operating Systems (CS 301)',
        availableMinutes: 90,
        goal: 'Master Process Scheduling algorithms',
        blocks: [
          { time: '00 - 20m', phase: 'Concept Intake', details: 'Review round robin and priority scheduling notes.' },
          { time: '20 - 55m', phase: 'Hard Problem Solving', details: 'Solve 3 process scheduling gantt chart problems.' },
          { time: '55 - 65m', phase: 'Tactical Rest', details: 'Hydrate and step away from display.' },
          { time: '65 - 85m', phase: 'Active Recall', details: 'Implement scheduler logic in pseudocode from memory.' },
          { time: '85 - 90m', phase: 'Debrief', details: 'Log weak spots for tomorrow.' }
        ]
      };
    } catch { return null; }
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('mc_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('mc_sessions_count', sessionsCount.toString());
    localStorage.setItem('mc_focused_minutes', focusedMinutes.toString());
  }, [sessionsCount, focusedMinutes]);

  useEffect(() => {
    if (currentPlan) localStorage.setItem('mc_plan', JSON.stringify(currentPlan));
  }, [currentPlan]);

  // Telemetry clock tick
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogFocusSession = (mins) => {
    setSessionsCount((prev) => prev + 1);
    setFocusedMinutes((prev) => prev + mins);
  };

  const toggleMission = (id) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const exportData = () => {
    const backup = { missions, sessionsCount, focusedMinutes, currentPlan, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission_control_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.missions) setMissions(data.missions);
        if (data.sessionsCount !== undefined) setSessionsCount(data.sessionsCount);
        if (data.focusedMinutes !== undefined) setFocusedMinutes(data.focusedMinutes);
        if (data.currentPlan) setCurrentPlan(data.currentPlan);
        alert('Mission logs successfully restored.');
      } catch (err) {
        alert('Invalid file format. Upload a valid JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  const formatStardate = (d) => {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} // ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#070b0e] text-slate-200 font-sans p-3 sm:p-6 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <header className="border border-emerald-500/30 bg-[#0c1216]/90 backdrop-blur-md rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-widest text-emerald-400 uppercase font-mono">
                  MISSION CONTROL
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                  SYS V1.0 // ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">STUDENT AI COMMAND OPERATING CENTER</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
            <div className="bg-[#06090c] border border-emerald-500/30 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{formatStardate(currentTime)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={exportData} title="Backup data" className="p-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center gap-1.5 transition">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <label title="Restore data" className="p-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Import</span>
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Command Matrix (All)' },
            { id: 'missions', label: 'Daily Missions' },
            { id: 'focus', label: 'Focus Chamber' },
            { id: 'planner', label: 'Study Planner' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-[#0c1216] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Section 4 & 5: Briefing & Progress */}
        {(activeTab === 'all' || activeTab === 'missions') && (
          <DailyBriefing
            missions={missions}
            onToggleMission={toggleMission}
            sessionsCount={sessionsCount}
            focusedMinutes={focusedMinutes}
            onJumpToFocus={() => setActiveTab('focus')}
          />
        )}

        {/* Section 1: Daily Missions */}
        {(activeTab === 'all' || activeTab === 'missions') && (
          <DailyMissions missions={missions} setMissions={setMissions} />
        )}

        {/* Section 2: Focus Mode */}
        {(activeTab === 'all' || activeTab === 'focus') && (
          <FocusChamber onLogSession={handleLogFocusSession} />
        )}

        {/* Section 3: Study Planner */}
        {(activeTab === 'all' || activeTab === 'planner') && (
          <StudyPlanner currentPlan={currentPlan} onSavePlan={setCurrentPlan} />
        )}
      </div>

      <footer className="mt-8 text-center text-[11px] font-mono text-slate-600 border-t border-slate-900 pt-4">
        MISSION CONTROL OPERATING SYSTEM // ZERO EXTERNAL APIS // LOCAL FIRST PERSISTENCE ACTIVE
      </footer>
    </div>
  );
}
