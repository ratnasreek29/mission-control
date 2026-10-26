import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { playTone } from '../utils/sound';

export default function StudyPlanner({ currentPlan, onSavePlan }) {
  const [subject, setSubject] = useState(currentPlan?.subject || 'Data Structures & Algorithms');
  const [minutes, setMinutes] = useState(currentPlan?.availableMinutes || 90);
  const [goal, setGoal] = useState(currentPlan?.goal || 'Master Dijkstra algorithm and solve 2 traversal problems');

  const handleGenerate = (e) => {
    e.preventDefault();
    const duration = parseInt(minutes, 10) || 60;
    const cleanSubj = subject.trim() || 'General Academics';
    const cleanGoal = goal.trim() || 'Exam prep and synthesis';

    let blocks = [];
    if (duration <= 30) {
      blocks = [
        { time: `00 - ${Math.round(duration * 0.2)}m`, phase: 'Scope & Priming', details: `Scan core concepts and definitions for ${cleanSubj}.` },
        { time: `${Math.round(duration * 0.2)} - ${Math.round(duration * 0.85)}m`, phase: 'Deep Execution Sprint', details: `Intense focus on: ${cleanGoal}` },
        { time: `${Math.round(duration * 0.85)} - ${duration}m`, phase: 'Active Retrieval', details: 'Write 3 core takeaways from pure memory without looking at notes.' }
      ];
    } else if (duration <= 60) {
      blocks = [
        { time: '00 - 10m', phase: 'Theory Priming', details: `Review textbook and formulas for ${cleanSubj}.` },
        { time: '10 - 45m', phase: 'Hard Problem Solving', details: `Execute practical problem set: ${cleanGoal}.` },
        { time: '45 - 55m', phase: 'Active Recall Check', details: 'Close all tabs. Write out the core logic from scratch.' },
        { time: '55 - 60m', phase: 'Error Logging', details: 'Record 1 weak point to address in your next session.' }
      ];
    } else {
      const p1 = Math.round(duration * 0.2);
      const p2 = Math.round(duration * 0.55);
      const breakEnd = p2 + 10;
      const p3 = Math.round(duration * 0.9);
      blocks = [
        { time: `00 - ${p1}m`, phase: 'Theory Priming', details: `Review core syllabus checkpoints for ${cleanSubj}.` },
        { time: `${p1} - ${p2}m`, phase: 'Deep Construction Block', details: `Zero-distraction solving: ${cleanGoal}.` },
        { time: `${p2} - ${breakEnd}m`, phase: 'Tactical Rest & Hydration', details: 'Step away from screen. Hydrate and let brain consolidate concepts.' },
        { time: `${breakEnd} - ${p3}m`, phase: 'Active Recall Testing', details: 'Timed mock questions and code synthesis from pure memory.' },
        { time: `${p3} - ${duration}m`, phase: 'Debrief & Error Log', details: 'Log questions for professor office hours or forum query.' }
      ];
    }

    onSavePlan({
      subject: cleanSubj,
      availableMinutes: duration,
      goal: cleanGoal,
      blocks
    });
    playTone(840, 'triangle', 0.25);
  };

  return (
    <div className="bg-[#0c1216] border border-slate-800 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-6">
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-mono tracking-wider uppercase text-emerald-400 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>ALGORITHMIC STUDY PLANNER</span>
          </h2>
          <p className="text-xs text-slate-400">Generate structured active-recall study protocols without paid APIs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form Inputs */}
        <form onSubmit={handleGenerate} className="lg:col-span-2 space-y-4 bg-[#06090c] p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Subject / Course</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Available Duration (Minutes)</label>
            <input
              type="number"
              min="15"
              max="360"
              required
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Session Target / Goal</label>
            <textarea
              rows="3"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Understand mutex deadlocks and complete 3 practice problems"
              className="w-full bg-[#0c1216] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
          >
            <Sparkles className="w-4 h-4" />
            Synthesize Schedule
          </button>
        </form>

        {/* Generated Schedule Timeline */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-slate-800">
            <span className="uppercase text-emerald-400 font-semibold">{currentPlan?.subject}</span>
            <span>{currentPlan?.availableMinutes} MIN PROTOCOL</span>
          </div>

          <div className="text-xs text-slate-300 italic mb-2">
            Target: "{currentPlan?.goal}"
          </div>

          <div className="space-y-2">
            {currentPlan?.blocks?.map((block, idx) => (
              <div key={idx} className="bg-[#06090c] border border-slate-800/90 hover:border-emerald-500/30 rounded-lg p-3 flex items-start gap-3 transition">
                <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded whitespace-nowrap mt-0.5">
                  {block.time}
                </span>
                <div>
                  <div className="text-xs font-bold font-mono text-slate-200 uppercase">{block.phase}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{block.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
