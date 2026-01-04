import React, { useMemo } from 'react';
import { AlertTriangle, Brain, LineChart, Target, TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';

const SUBJECT_KEYS = [
  { key: 'mathematics', label: 'Maths' },
  { key: 'physics', label: 'Physics' },
  { key: 'chemistry', label: 'Chemistry' },
  { key: 'english', label: 'English' },
  { key: 'computerScience', label: 'CS' }
];

const InsightCard = ({ icon: Icon, label, value, meta }) => (
  <div className="p-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white/90 dark:bg-white/5 shadow-sm flex flex-col gap-1">
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Icon size={16} />
      {label}
    </div>
    <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
    {meta && <div className="text-xs text-gray-500 dark:text-gray-400">{meta}</div>}
  </div>
);

const InsightsPanel = ({ items }) => {
  const stats = useMemo(() => {
    const total = items.length;
    const passCount = items.filter((s) => s.passStatus === 'Pass').length;
    const failCount = total - passCount;
    const avg = total ? items.reduce((sum, s) => sum + (s.percentage || 0), 0) / total : 0;
    const atRisk = items.filter((s) => {
      const subj = s.subjects || {};
      return Object.values(subj).some((score) => Number(score) < 45);
    }).length;

    const deptMap = new Map();
    items.forEach((s) => {
      const entry = deptMap.get(s.department) || { total: 0, sum: 0 };
      entry.total += 1;
      entry.sum += s.percentage || 0;
      deptMap.set(s.department, entry);
    });
    let bestDept = '—';
    let bestDeptAvg = 0;
    Array.from(deptMap.entries()).forEach(([dept, { total: deptTotal, sum }]) => {
      const avgDept = deptTotal ? sum / deptTotal : 0;
      if (avgDept > bestDeptAvg) {
        bestDeptAvg = avgDept;
        bestDept = dept;
      }
    });

    const subjectAverages = SUBJECT_KEYS.map(({ key, label }) => {
      const subjectScores = items.map((s) => Number(s?.subjects?.[key]) || 0);
      const subjectAvg = subjectScores.length
        ? subjectScores.reduce((sum, val) => sum + val, 0) / subjectScores.length
        : 0;
      return { subject: label, avg: Number(subjectAvg.toFixed(1)) };
    });

    const hardestSubject = subjectAverages.reduce((min, subject) => {
      if (!min || subject.avg < min.avg) return subject;
      return min;
    }, null);

    return {
      total,
      avg: Number(avg.toFixed(2)),
      passRate: total ? Number(((passCount / total) * 100).toFixed(1)) : 0,
      failCount,
      atRisk,
      bestDept,
      subjectAverages,
      hardestSubject
    };
  }, [items]);

  const suggestions = useMemo(() => {
    const tips = [];
    if (stats.passRate < 80) {
      tips.push('Pass rate is below 80%. Prioritize remedial sessions for students scoring <50%.');
    }
    if (stats.hardestSubject && stats.hardestSubject.avg < 70) {
      tips.push(`Average in ${stats.hardestSubject.subject} is ${stats.hardestSubject.avg}. Consider a focused workshop or guest lecture.`);
    }
    if (stats.atRisk > 0) {
      tips.push(`${stats.atRisk} student(s) have at least one subject below 45. Flag them for mentoring.`);
    }
    if (stats.bestDept !== '—') {
      tips.push(`Replicate best practices from the ${stats.bestDept} department across other branches.`);
    }
    if (tips.length === 0) {
      tips.push('Metrics look healthy. Keep tracking trends weekly to maintain momentum.');
    }
    return tips;
  }, [stats]);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 shadow-xl p-6 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-600 dark:text-primary-300 font-semibold">Analytics snapshot</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Insights & Health</h3>
        </div>
        <span className="insight-pill bg-primary-contrast text-primary-600 dark:text-primary-100 border border-primary/20">
          <LineChart size={16} />
          Auto-refreshed
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <InsightCard icon={TrendingUp} label="Pass rate" value={`${stats.passRate}%`} meta={`${stats.total} students`} />
        <InsightCard icon={Brain} label="Average score" value={`${stats.avg}%`} meta={`Top dept: ${stats.bestDept}`} />
        <InsightCard icon={AlertTriangle} label="At risk" value={stats.atRisk} meta="Subject < 45" />
        <InsightCard icon={Target} label="Need support" value={stats.failCount} meta="Failed overall" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 mt-6">
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white/70 dark:bg-white/5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="m-0 text-base font-semibold">Subject radar</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">Avg out of 100</span>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={stats.subjectAverages}>
                <PolarGrid stroke="rgba(148,163,184,0.4)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" />
                <Radar
                  name="Average"
                  dataKey="avg"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white/70 dark:bg-white/5">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
            <AlertTriangle size={16} />
            Actionable next steps
          </div>
          <ul className="list-unstyled m-0 flex flex-col gap-3 text-sm text-gray-700 dark:text-gray-200">
            {suggestions.map((tip, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;


