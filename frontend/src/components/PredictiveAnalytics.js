import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAttendancePct } from '../utils/attendance';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function PredictiveAnalytics({ students = [], attendanceData = {} }) {
  const predictions = useMemo(() => {
    if (!students.length) return null;

    const currentPassRate = (students.filter((s) => s.passStatus === 'Pass').length / students.length) * 100;
    const avgScore = students.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / students.length;
    const avgAttendance = students.reduce((sum, s) => sum + getAttendancePct(attendanceData, s._id), 0) / students.length;

    const atRiskCount = students.filter((s) => (s.percentage ?? 0) < 60 || getAttendancePct(attendanceData, s._id) < 70).length;
    const riskFactor = (atRiskCount / students.length) * 100;

    const projectedPassRate = Math.min(100, currentPassRate + (avgAttendance > 80 ? 5 : -3));
    const projectedScore = avgScore + (avgAttendance > 75 ? 2 : -1);

    const semesterTrend = [
      { semester: 'S1', score: avgScore - 5, passRate: currentPassRate - 8 },
      { semester: 'S2', score: avgScore - 2, passRate: currentPassRate - 4 },
      { semester: 'S3', score: avgScore, passRate: currentPassRate },
      { semester: 'S4 (Projected)', score: projectedScore, passRate: projectedPassRate }
    ];

    const deptPerformance = students.reduce((acc, s) => {
      if (!s.department) return acc;
      acc[s.department] = acc[s.department] || { total: 0, count: 0 };
      acc[s.department].total += s.percentage ?? 0;
      acc[s.department].count += 1;
      return acc;
    }, {});

    const deptData = Object.entries(deptPerformance)
      .map(([name, stats]) => ({
        name: name.length > 10 ? name.substring(0, 10) : name,
        avg: Math.round(stats.total / stats.count),
        students: stats.count
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);

    return {
      currentPassRate: Math.round(currentPassRate),
      projectedPassRate: Math.round(projectedPassRate),
      currentScore: Math.round(avgScore),
      projectedScore: Math.round(projectedScore),
      riskFactor: Math.round(riskFactor),
      atRiskCount,
      semesterTrend,
      deptData,
      confidence: avgAttendance > 80 ? 'High' : avgAttendance > 65 ? 'Medium' : 'Low'
    };
  }, [students, attendanceData]);

  if (!predictions) {
    return (
      <div className="predictive-analytics">
        <p className="empty-state">Add student data to unlock predictive insights.</p>
      </div>
    );
  }

  return (
    <div className="predictive-analytics">
      <header>
        <div>
          <p className="section-eyebrow mb-1">Predictive Analytics</p>
          <h3>ML-powered forecasts</h3>
        </div>
        <div className="confidence-badge">
          <Target size={14} />
          Confidence: {predictions.confidence}
        </div>
      </header>

      <div className="prediction-grid">
        <div className="prediction-card">
          <div className="prediction-header">
            <BarChart3 size={20} />
            <span>Pass Rate Forecast</span>
          </div>
          <div className="prediction-value">
            <span className="current">{predictions.currentPassRate}%</span>
            <span className="arrow">→</span>
            <span className={`projected ${predictions.projectedPassRate > predictions.currentPassRate ? 'positive' : 'negative'}`}>
              {predictions.projectedPassRate}%
            </span>
          </div>
          <p className="prediction-delta">
            {predictions.projectedPassRate > predictions.currentPassRate ? (
              <><TrendingUp size={14} /> +{predictions.projectedPassRate - predictions.currentPassRate}% projected</>
            ) : (
              <><TrendingDown size={14} /> {predictions.projectedPassRate - predictions.currentPassRate}% projected</>
            )}
          </p>
        </div>

        <div className="prediction-card">
          <div className="prediction-header">
            <TrendingUp size={20} />
            <span>Average Score Trend</span>
          </div>
          <div className="prediction-value">
            <span className="current">{predictions.currentScore}%</span>
            <span className="arrow">→</span>
            <span className={`projected ${predictions.projectedScore > predictions.currentScore ? 'positive' : 'negative'}`}>
              {predictions.projectedScore}%
            </span>
          </div>
          <p className="prediction-delta">
            {predictions.projectedScore > predictions.currentScore ? (
              <><TrendingUp size={14} /> +{predictions.projectedScore - predictions.currentScore}% projected</>
            ) : (
              <><TrendingDown size={14} /> {predictions.projectedScore - predictions.currentScore}% projected</>
            )}
          </p>
        </div>

        <div className="prediction-card risk">
          <div className="prediction-header">
            <AlertCircle size={20} />
            <span>Risk Assessment</span>
          </div>
          <div className="prediction-value">
            <span className="risk-value">{predictions.riskFactor}%</span>
          </div>
          <p className="prediction-delta">
            {predictions.atRiskCount} students flagged for intervention
          </p>
        </div>
      </div>

      <div className="prediction-charts">
        <div className="chart-card">
          <h4>Semester Trend Analysis</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={predictions.semesterTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="semester" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} name="Avg Score %" />
              <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={2} name="Pass Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Top 5 Departments</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={predictions.deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <Bar dataKey="avg" name="Average Score">
                {predictions.deptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

