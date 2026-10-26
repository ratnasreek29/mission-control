import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { playTone } from '../utils/sound';

export default function FocusChamber({ onLogSession }) {
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      // Audible mission complete chime
      playTone(880, 'sine', 0.3);
      setTimeout(() => playTone(1200, 'triangle', 0.4), 250);
      onLogSession(durationMinutes);
      setSecondsLeft(durationMinutes * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, durationMinutes, onLogSession]);

  const toggleTimer = () => {
    playTone(isRunning ? 400 : 700, 'sine', 0.15);
    setIsRunning(!isRunning);
  };

  const resetTimer = (newDuration = durationMinutes) => {
    setIsRunning(false);
    setDurationMinutes(newDuration);
    setSecondsLeft(newDuration * 60);
    playTone(350, 'square', 0.1);
  };

  const handleManualComplete = () => {
    playTone(1050, 'sine', 0.3);
    onLogSession(durationMinutes);
    resetTimer(durationMinutes);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressFraction = ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100;

  return (
    <div className="bg-[#0c1216] border border-slate-800 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between space-y-6">
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold font-mono tracking-wider uppercase text-emerald-400">
            FOCUS CHAMBER
          </h2>
          <p className="text-xs text-slate-400">Deep cognitive sprint protocol.</p>
        </div>

        {/* Preset selectors */}
        <div className="flex gap-1.5 bg-[#06090c] p-1 border border-slate-800 rounded-lg">
          {[15, 25, 50].map((dur) => (
            <button
              key={dur}
              onClick={() => resetTimer(dur)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition ${
                durationMinutes === dur
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {dur}m
            </button>
          ))}
        </div>
      </div>

      {/* Futuristic Circular / Countdown Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <div className="w-56 h-56 rounded-full border-4 border-slate-800 flex items-center justify-center relative bg-[#06090c] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
          {/* Subtle spinning glow accent during active timer */}
          {isRunning && (
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/50 animate-ping pointer-events-none" />
          )}

          <div className="text-center z-10">
            <span className="font-mono text-5xl font-black tracking-wider text-slate-100">
              {formatTime(secondsLeft)}
            </span>
            <div className="font-mono text-[11px] text-emerald-400 tracking-widest uppercase mt-1">
              {isRunning ? 'DEEP SPRINT ACTIVE' : 'STANDBY MODE'}
            </div>
          </div>
        </div>

        {/* Linear progress under indicator */}
        <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-4 border border-slate-800">
          <div
            className="h-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${progressFraction}%` }}
          />
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          onClick={toggleTimer}
          className={`px-6 py-2.5 rounded-lg font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition ${
            isRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause Engine' : 'Engage Timer'}</span>
        </button>

        <button
          onClick={() => resetTimer(durationMinutes)}
          className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 rounded-lg transition"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleManualComplete}
          className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 rounded-lg font-mono text-xs uppercase font-semibold transition flex items-center gap-1.5"
          title="Mark current block completed"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Mark Completed</span>
        </button>
      </div>
    </div>
  );
}
