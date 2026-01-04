import React, { useMemo, useState } from 'react';
import { Calculator, DownloadCloud, Sparkles } from 'lucide-react';

const SUBJECT_COUNT = 5;

const GoalPlanner = ({ items }) => {
  const [targetAvg, setTargetAvg] = useState(85);
  const [targetPassRate, setTargetPassRate] = useState(92);

  const stats = useMemo(() => {
    const total = items.length;
    const avg = total ? items.reduce((sum, s) => sum + (s.percentage || 0), 0) / total : 0;
    const passRate = total ? (items.filter((s) => s.passStatus === 'Pass').length / total) * 100 : 0;
    return {
      total,
      avg: Number(avg.toFixed(2)),
      passRate: Number(passRate.toFixed(1))
    };
  }, [items]);

  const avgGap = Math.max(0, targetAvg - stats.avg);
  const passGap = Math.max(0, targetPassRate - stats.passRate);
  const extraMarksPerStudent = Number(((avgGap / 100) * SUBJECT_COUNT * 100).toFixed(1));
  const extraPassStudents = Math.ceil((passGap / 100) * stats.total);

  const plan = useMemo(() => ({
    generatedAt: new Date().toISOString(),
    current: stats,
    targets: { targetAvg, targetPassRate },
    recommendations: {
      focusMarksPerStudent: extraMarksPerStudent,
      additionalPassStudents: extraPassStudents,
      cadence: passGap > 0 ? 'Bi-weekly mentoring recommended' : 'Maintain monthly audits'
    }
  }), [stats, targetAvg, targetPassRate, extraMarksPerStudent, extraPassStudents, passGap]);

  const downloadPlan = () => {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `student-improvement-plan-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const renderProgress = (current, target) => {
    const pct = Math.min(100, (current / target) * 100);
    return (
      <div className="mt-2">
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--primary)' }}></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{pct.toFixed(1)}% of target</div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/70 shadow-xl p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-600 dark:text-primary-300 font-semibold">What-if planner</div>
          <h3 className="text-2xl font-semibold mb-1">Achievement Simulator</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 m-0">Model the lift needed to hit your next milestone.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-white text-sm shadow-lg hover:bg-primary-700 transition"
          onClick={downloadPlan}
        >
          <DownloadCloud size={16} />
          Export action plan
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white/70 dark:bg-white/5">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calculator size={16} />
            Targets
          </div>
          <label className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-200">Target average (%)</label>
          <input
            type="range"
            min="50"
            max="100"
            value={targetAvg}
            onChange={(e) => setTargetAvg(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-lg font-semibold">{targetAvg}%</div>
          {renderProgress(stats.avg, targetAvg)}

          <label className="mt-6 text-sm font-medium text-gray-700 dark:text-gray-200">Target pass rate (%)</label>
          <input
            type="range"
            min="60"
            max="100"
            value={targetPassRate}
            onChange={(e) => setTargetPassRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-lg font-semibold">{targetPassRate}%</div>
          {renderProgress(stats.passRate, targetPassRate)}
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white/70 dark:bg-white/5">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Sparkles size={16} />
            Recommended moves
          </div>
          <ul className="list-unstyled m-0 mt-4 text-sm text-gray-700 dark:text-gray-200 space-y-3">
            <li>• Add roughly <strong>{extraMarksPerStudent}</strong> marks per student across {SUBJECT_COUNT} subjects to hit the average goal.</li>
            <li>• Elevate <strong>{extraPassStudents}</strong> more students above the pass threshold to meet the pass-rate target.</li>
            <li>• {plan.recommendations.cadence} with spotlight on the weakest subject per Insights.</li>
          </ul>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            The numbers auto-update whenever the dataset changes so you can screenshot this widget for reports.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanner;


