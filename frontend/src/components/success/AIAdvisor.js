import React, { useMemo, useState } from 'react';
import { Sparkles, SendHorizontal } from 'lucide-react';

export default function AIAdvisor({ students = [] }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const stats = useMemo(() => {
    if (!students.length) {
      return { avg: 0, passRate: 0, total: 0 };
    }
    const avg = students.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / students.length;
    const passRate = (students.filter((s) => s.passStatus === 'Pass').length / students.length) * 100;
    return { avg: Math.round(avg), passRate: Math.round(passRate), total: students.length };
  }, [students]);

  const handleGenerate = () => {
    const topic = prompt || 'general uplift';
    const plan = [
      `• Group labs pairing top ${Math.min(5, Math.round(stats.total * 0.1))} performers with emerging talent.`,
      '• Embed daily 3-minute reflection check-ins to boost wellbeing.',
      '• Trigger guardian digests for students below 70% to activate support squads.'
    ];
    setResponse(`Strategy for ${topic}:\n${plan.join('\n')}\nMetrics watch: cohort avg ${stats.avg}%, pass rate ${stats.passRate}% (${stats.total} students).`);
  };

  return (
    <section className="success-card ai-advisor">
      <header>
        <p className="section-eyebrow mb-1">AI Advisor</p>
        <h3>Ask for a plan</h3>
      </header>
      <div className="ai-input">
        <Sparkles size={16} />
        <input
          type="text"
          placeholder="E.g. “How can I lift first-year CS attendance?”"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="button" onClick={handleGenerate}>
          <SendHorizontal size={16} />
          Generate
        </button>
      </div>
      {response && (
        <pre className="ai-response">{response}</pre>
      )}
    </section>
  );
}

