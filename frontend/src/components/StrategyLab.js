import React, { useMemo, useState } from 'react';
import { Brain, Target, TrendingUp, Download, Sparkles, Activity } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

const focusOptions = [
  { id: 'passRate', label: 'Pass rate lift' },
  { id: 'attendance', label: 'Attendance boost' },
  { id: 'wellbeing', label: 'Wellbeing focus' }
];

const personaPalette = {
  trailblazers: { label: 'Trailblazers', color: 'from-emerald-400 to-emerald-600' },
  comebackCrew: { label: 'Comeback Crew', color: 'from-amber-400 to-orange-500' },
  stealthAchievers: { label: 'Stealth Achievers', color: 'from-sky-400 to-blue-500' },
  atRisk: { label: 'Critical Watch', color: 'from-rose-400 to-rose-600' }
};

export default function StrategyLab({ students = [], attendanceData = {}, onExportPlan }) {
  const [focus, setFocus] = useState('passRate');
  const [extraHours, setExtraHours] = useState(3);
  const [sprintLength, setSprintLength] = useState(4);

  const personas = useMemo(() => {
    const summary = {
      trailblazers: [],
      comebackCrew: [],
      stealthAchievers: [],
      atRisk: []
    };

    students.forEach((student) => {
      const pct = student.percentage ?? 0;
      const attendancePct = getAttendancePct(attendanceData, student._id);
      if (pct >= 80 && attendancePct >= 90) {
        summary.trailblazers.push(student);
      } else if (pct < 65 && attendancePct >= 85) {
        summary.comebackCrew.push(student);
      } else if (pct >= 75 && attendancePct < 70) {
        summary.stealthAchievers.push(student);
      } else if (pct < 60 || attendancePct < 60) {
        summary.atRisk.push(student);
      }
    });
    return summary;
  }, [students, attendanceData]);

  const matrix = useMemo(() => {
    const buckets = {
      highHigh: [],
      highLow: [],
      lowHigh: [],
      lowLow: []
    };
    students.forEach((student) => {
      const pct = student.percentage ?? 0;
      const attendancePct = getAttendancePct(attendanceData, student._id);
      const performance = pct >= 70 ? 'high' : 'low';
      const attendance = attendancePct >= 80 ? 'High' : 'Low';
      buckets[`${performance}${attendance}`]?.push({
        ...student,
        attendancePct
      });
    });
    return buckets;
  }, [students, attendanceData]);

  const projectedImpact = useMemo(() => {
    if (!students.length) {
      return { passRate: 0, expectedLift: 0, message: 'Add students to unlock the lab.' };
    }
    const baselinePass = (students.filter((s) => s.passStatus === 'Pass').length / students.length) * 100;
    const lift = Math.min(15, extraHours * 1.5 + sprintLength * 0.8);
    const focusBonus = focus === 'attendance' ? 1.1 : focus === 'wellbeing' ? 0.9 : 1;
    const expectedLift = Number((lift * focusBonus).toFixed(1));
    const projectedPassRate = Math.min(100, Number((baselinePass + expectedLift).toFixed(1)));
    let message = 'Balanced uplift for the entire cohort.';
    if (focus === 'attendance') message = 'Prioritize schedule rituals, studio hours, and peer accountability.';
    if (focus === 'wellbeing') message = 'Blend micro-breaks, mentorship pods, and wellness nudges.';
    return { passRate: projectedPassRate, expectedLift, message, baselinePass: Number(baselinePass.toFixed(1)) };
  }, [students, extraHours, sprintLength, focus]);

  const exportPlan = () => {
    if (!onExportPlan) return;
    const payload = {
      generatedAt: new Date().toISOString(),
      focus,
      knobs: { extraHours, sprintLength },
      personas: Object.fromEntries(
        Object.entries(personas).map(([key, list]) => [key, list.map((student) => ({
          id: student._id,
          name: student.name,
          percentage: student.percentage,
          department: student.department,
          attendance: getAttendancePct(attendanceData, student._id)
        }))])
      ),
      focusMatrix: Object.fromEntries(
        Object.entries(matrix).map(([key, list]) => [key, list.map((student) => ({
          id: student._id,
          name: student.name,
          percentage: student.percentage,
          attendance: student.attendancePct
        }))])
      ),
      projection: projectedImpact
    };
    onExportPlan('strategy-lab-plan.json', payload);
  };

  const personaEntries = Object.entries(personas);

  return (
    <div className="strategy-lab grid gap-6">
      <div className="lab-card glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-primary-500" size={22} />
          <div>
            <p className="section-eyebrow mb-0">Persona radar</p>
            <h3 className="text-xl font-semibold">Unique cohorts</h3>
          </div>
        </div>
        {students.length === 0 ? (
          <p className="text-sm text-slate-500">Add student records to see personas populate automatically.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {personaEntries.map(([key, list]) => {
              const palette = personaPalette[key];
              const percent = Math.round((list.length / Math.max(1, students.length)) * 100);
              return (
                <div
                  key={key}
                  className={`rounded-2xl border border-white/10 bg-gradient-to-br ${palette?.color || 'from-slate-500 to-slate-700'} text-white p-4 shadow-lg backdrop-blur`}
                >
                  <p className="text-sm uppercase tracking-wide opacity-80">{palette?.label || key}</p>
                  <p className="text-3xl font-bold">{percent}%</p>
                  <p className="text-xs opacity-80">{list.length} students</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="lab-card glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-primary-500" size={22} />
          <div>
            <p className="section-eyebrow mb-0">Sprint knobs</p>
            <h3 className="text-xl font-semibold">Impact simulator</h3>
          </div>
        </div>
        <div className="grid gap-4 mb-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Extra guided hours per week: {extraHours}h</span>
            <input type="range" min="1" max="10" value={extraHours} onChange={(e) => setExtraHours(Number(e.target.value))} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sprint length (weeks): {sprintLength}</span>
            <input type="range" min="2" max="12" value={sprintLength} onChange={(e) => setSprintLength(Number(e.target.value))} />
          </label>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {focusOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`px-3 py-1.5 rounded-full text-sm border ${focus === option.id ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-300 text-slate-600 dark:text-slate-300'}`}
              onClick={() => setFocus(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-slate-900 text-white p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.27em] text-white/70">Projected pass rate</p>
          <p className="text-4xl font-bold mt-1">{projectedImpact.passRate}%</p>
          <p className="text-sm text-white/80">Baseline {projectedImpact.baselinePass || 0}% → +{projectedImpact.expectedLift}%</p>
          <p className="text-sm mt-3 text-white/90">{projectedImpact.message}</p>
        </div>
      </div>

      <div className="lab-card glass-panel p-6 md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-primary-500" size={22} />
          <div>
            <p className="section-eyebrow mb-0">Focus matrix</p>
            <h3 className="text-xl font-semibold">Where to intervene next</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { key: 'highHigh', label: 'Reliable rockstars', tone: 'Keep momentum with leadership opportunities.' },
            { key: 'highLow', label: 'Quiet performers', tone: 'Design micro-routines to stabilize attendance.' },
            { key: 'lowHigh', label: 'Motivated strivers', tone: 'Pair with mentors and concept refreshers.' },
            { key: 'lowLow', label: 'Critical watchlist', tone: 'Deploy rapid-response coaching squads.' }
          ].map((bucket) => {
            const list = matrix[bucket.key] || [];
            return (
              <div key={bucket.key} className="border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">{bucket.label}</span>
                  <span className="text-slate-500">{list.length} students</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{bucket.tone}</p>
                <div className="space-y-2 max-h-40 overflow-auto pr-1">
                  {list.slice(0, 6).map((student) => (
                    <div key={student._id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{student.name}</span>
                      <span className="text-xs text-slate-500">{student.percentage ?? 0}% · {student.attendancePct}%</span>
                    </div>
                  ))}
                  {list.length > 6 && (
                    <p className="text-xs text-slate-500">+{list.length - 6} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lab-card glass-panel p-6 md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-primary-500" size={22} />
          <div>
            <p className="section-eyebrow mb-0">Micro playbooks</p>
            <h3 className="text-xl font-semibold">Experiments ready to run</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Peer accelerator pods',
              description: 'Match trailblazers with comeback crew for 20-minute sprints twice a week.',
              metric: `${Math.min(20, personas.trailblazers.length)} mentors ready`
            },
            {
              title: 'Focus guardians',
              description: 'Assign accountability buddies for stealth achievers with erratic attendance.',
              metric: `${personas.stealthAchievers.length} stealth achievers`
            },
            {
              title: 'Rapid rescue desk',
              description: 'Daily 30-min standups for the critical watchlist with counselors on-call.',
              metric: `${personas.atRisk.length} students flagged`
            }
          ].map((playbook) => (
            <div key={playbook.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-sm uppercase tracking-wide text-primary-500">{playbook.metric}</p>
              <h4 className="text-lg font-semibold mt-1">{playbook.title}</h4>
              <p className="text-sm text-slate-500 mt-2">{playbook.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 text-white px-5 py-2 text-sm shadow-lg"
            onClick={exportPlan}
          >
            <Download size={16} />
            Export strategy JSON
          </button>
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <Activity size={14} />
            Snapshot includes personas, matrix clusters, and projection knobs.
          </p>
        </div>
      </div>
    </div>
  );
}

