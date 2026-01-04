import React, { useMemo } from 'react';
import { BarChart2, Send, Download } from 'lucide-react';

export default function EngagementSurveys({ students = [], onExport }) {
  const surveyStats = useMemo(() => {
    if (!students.length) {
      return { engagement: 0, wellbeing: 0, responseRate: 0 };
    }
    const engagement = Math.round(
      Math.min(100, students.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / students.length + 10)
    );
    const wellbeing = Math.round(Math.min(100, engagement - 5 + (students.length % 10)));
    const responseRate = Math.min(100, 65 + (students.length % 20));
    return { engagement, wellbeing, responseRate };
  }, [students]);

  const exportPayload = () => {
    if (!onExport) return;
    onExport('engagement-survey-blueprint.json', {
      generatedAt: new Date().toISOString(),
      snapshot: surveyStats,
      questions: [
        'How confident do you feel about upcoming assessments?',
        'Where do you need the most support this week?',
        'How would you rate your overall wellbeing?'
      ]
    });
  };

  return (
    <section className="success-card engagement-surveys">
      <header>
        <p className="section-eyebrow mb-1">Micro-surveys</p>
        <h3>Engagement pulse</h3>
      </header>
      <div className="survey-stats">
        {[
          { label: 'Engagement', value: surveyStats.engagement },
          { label: 'Wellbeing', value: surveyStats.wellbeing },
          { label: 'Response rate', value: surveyStats.responseRate }
        ].map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
            <div className="progress-bar thin">
              <span style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="survey-actions">
        <button type="button">
          <Send size={16} />
          Launch micro-survey
        </button>
        <button type="button" onClick={exportPayload}>
          <Download size={16} />
          Export blueprint
        </button>
      </div>
      <p className="survey-footnote">
        <BarChart2 size={14} />
        Auto-sync results into Insights after publishing.
      </p>
    </section>
  );
}

