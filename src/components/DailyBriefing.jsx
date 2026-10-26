import React from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const BRIEFINGS = [
  "Execute cleanly. Friction is just data showing where your technique needs refinement.",
  "High cognitive output demands ruthlessly prioritized focus. Eliminate side quests.",
  "One deep work sprint completed with total concentration outweighs eight hours of fragmented distraction.",
  "Systems outperform willpower every single time. Follow your operational protocol."
];

export default function DailyBriefing({ missions, onToggleMission, sessionsCount, focusedMinutes, onJumpToFocus }) {
  const currentDate = new Date();
  const dayOfYear = Math.floor(
    (currentDate - new Date(currentDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const tacticalMessage = BRIEFINGS[dayOfYear % BRIEFINGS.length];

  const pendingMissions = missions.filter((m) => !m.completed);
  const completedMissions = missions.filter((m) => m.completed);
  const total = missions.length;
  const progressPercent = total > 0 ? Math.round((completedMissions.length / total) * 100) : 0;

  // Prioritize Critical, then High, then first available pending mission
  const nextCriticalMission =
    pendingMissions.find((m) => m.priority === 'Critical') ||
    pendingMissions.find((m) => m.priority === 'High') ||
    pendingMissions[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Tactical Directive Box */}
      <div className="lg:col-span-2 bg-[#0c1216] border border-emerald-500/30 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold">
                TACTICAL BRIEFING // {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 border border-slate-700 bg-slate-900 px-2 py-0.5 rounded">
              STATUS: NOMINAL
            </span>
          </div>

          <p className="text-slate-200 text-sm md:text-base italic pl-3 border-l-2 border-emerald-500 my-3 font-sans">
            "{tacticalMessage}"
          </p>
        </div>

        {/* Immediate Next Action Banner */}
        <div className="mt-2 bg-[#06090c] border border-emerald-500/20 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              IMMEDIATE DIRECTIVE / NEXT PRIORITY
            </div>
            <div className="text-sm font-semibold text-white">
              {nextCriticalMission ? nextCriticalMission.title : 'All primary directives fulfilled. Awaiting new missions.'}
            </div>
            {nextCriticalMission && (
              <div className="text-xs text-slate-400 font-mono">
                Category: <span className="text-slate-300">{nextCriticalMission.category}</span> | Priority: <span className="text-amber-300">{nextCriticalMission.priority}</span>
                {nextCriticalMission.deadline ? ` | Due: ${nextCriticalMission.deadline}` : ''}
              </div>
            )}
          </div>

          {nextCriticalMission ? (
            <button
              onClick={() => onToggleMission(nextCriticalMission.id)}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 rounded text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Complete Task
            </button>
          ) : (
            <button
              onClick={onJumpToFocus}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 whitespace-nowrap"
            >
              Enter Focus Chamber
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Telemetry Telemetry Gauges */}
      <div className="bg-[#0c1216] border border-slate-800 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-slate-400 mb-3">
            <span>FLIGHT TELEMETRY</span>
            <span className="text-emerald-400 font-bold">{progressPercent}% SYNC</span>
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Missions Fulfilled</span>
              <span>{completedMissions.length} / {total}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-slate-800">
          <div className="bg-[#06090c] p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-xl font-bold font-mono text-emerald-400">{sessionsCount}</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Focus Sprints</div>
          </div>
          <div className="bg-[#06090c] p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-xl font-bold font-mono text-emerald-400">{focusedMinutes}m</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Deep Work</div>
          </div>
        </div>
      </div>
    </div>
  );
}
