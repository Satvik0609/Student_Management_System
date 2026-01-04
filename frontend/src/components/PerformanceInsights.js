import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Target, BarChart3, Zap, Users } from 'lucide-react';

export default function PerformanceInsights({ students = [], attendanceData = {} }) {
  const insights = useMemo(() => {
    if (!students.length) return null;

    const total = students.length;
    const passed = students.filter(s => s.passStatus === 'Pass').length;
    const failed = students.filter(s => s.passStatus === 'Fail').length;
    const avgPercentage = students.reduce((sum, s) => sum + (s.percentage || 0), 0) / total;
    const avgAttendance = students.reduce((sum, s) => sum + (s.attendance || 0), 0) / total;

    // Performance tiers
    const excellent = students.filter(s => (s.percentage || 0) >= 80).length;
    const good = students.filter(s => (s.percentage || 0) >= 65 && (s.percentage || 0) < 80).length;
    const average = students.filter(s => (s.percentage || 0) >= 50 && (s.percentage || 0) < 65).length;
    const poor = students.filter(s => (s.percentage || 0) < 50).length;

    // Risk analysis
    const atRisk = students.filter(s => {
      const pct = s.percentage || 0;
      const att = s.attendance || 0;
      return pct < 60 || att < 70;
    }).length;

    // Top performers
    const topPerformers = [...students]
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
      .slice(0, 5);

    // Improvement opportunities
    const improvementOpps = students.filter(s => {
      const pct = s.percentage || 0;
      const att = s.attendance || 0;
      return pct >= 50 && pct < 70 && att >= 75;
    }).length;

    // Department breakdown
    const deptStats = students.reduce((acc, s) => {
      const dept = s.department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { total: 0, passed: 0, avgPct: 0 };
      }
      acc[dept].total++;
      if (s.passStatus === 'Pass') acc[dept].passed++;
      acc[dept].avgPct += s.percentage || 0;
      return acc;
    }, {});

    Object.keys(deptStats).forEach(dept => {
      deptStats[dept].avgPct = deptStats[dept].avgPct / deptStats[dept].total;
      deptStats[dept].passRate = (deptStats[dept].passed / deptStats[dept].total) * 100;
    });

    const bestDept = Object.entries(deptStats)
      .sort((a, b) => b[1].passRate - a[1].passRate)[0];

    return {
      total,
      passed,
      failed,
      passRate: (passed / total) * 100,
      avgPercentage,
      avgAttendance,
      excellent,
      good,
      average,
      poor,
      atRisk,
      topPerformers,
      improvementOpps,
      deptStats,
      bestDept: bestDept ? { name: bestDept[0], ...bestDept[1] } : null
    };
  }, [students, attendanceData]);

  if (!insights) {
    return (
      <div className="performance-insights">
        <div className="empty-state">
          <BarChart3 size={48} />
          <p>Add students to see performance insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-insights">
      <div className="insights-header">
        <div className="header-title">
          <BarChart3 size={28} />
          <h2>Performance Insights Dashboard</h2>
        </div>
        <div className="header-stats">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Users size={20} />
            </div>
            <div>
              <span className="stat-value">{insights.total}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">
              <Award size={20} />
            </div>
            <div>
              <span className="stat-value">{insights.passRate.toFixed(1)}%</span>
              <span className="stat-label">Pass Rate</span>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">
              <Target size={20} />
            </div>
            <div>
              <span className="stat-value">{insights.avgPercentage.toFixed(1)}%</span>
              <span className="stat-label">Avg Performance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="card-header">
            <TrendingUp size={20} />
            <h3>Performance Distribution</h3>
          </div>
          <div className="distribution-chart">
            <div className="dist-item">
              <div className="dist-bar excellent" style={{ width: `${(insights.excellent / insights.total) * 100}%` }}></div>
              <span className="dist-label">Excellent (80%+)</span>
              <span className="dist-count">{insights.excellent}</span>
            </div>
            <div className="dist-item">
              <div className="dist-bar good" style={{ width: `${(insights.good / insights.total) * 100}%` }}></div>
              <span className="dist-label">Good (65-79%)</span>
              <span className="dist-count">{insights.good}</span>
            </div>
            <div className="dist-item">
              <div className="dist-bar average" style={{ width: `${(insights.average / insights.total) * 100}%` }}></div>
              <span className="dist-label">Average (50-64%)</span>
              <span className="dist-count">{insights.average}</span>
            </div>
            <div className="dist-item">
              <div className="dist-bar poor" style={{ width: `${(insights.poor / insights.total) * 100}%` }}></div>
              <span className="dist-label">Needs Improvement (&lt;50%)</span>
              <span className="dist-count">{insights.poor}</span>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="card-header">
            <AlertTriangle size={20} />
            <h3>Risk Analysis</h3>
          </div>
          <div className="risk-metrics">
            <div className="risk-item high">
              <div className="risk-icon">
                <AlertTriangle size={24} />
              </div>
              <div className="risk-content">
                <span className="risk-label">At Risk Students</span>
                <span className="risk-value">{insights.atRisk}</span>
                <span className="risk-percent">{((insights.atRisk / insights.total) * 100).toFixed(1)}% of cohort</span>
              </div>
            </div>
            <div className="risk-item medium">
              <div className="risk-icon">
                <Zap size={24} />
              </div>
              <div className="risk-content">
                <span className="risk-label">Improvement Opportunities</span>
                <span className="risk-value">{insights.improvementOpps}</span>
                <span className="risk-percent">Students with potential</span>
              </div>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="card-header">
            <Award size={20} />
            <h3>Top Performers</h3>
          </div>
          <div className="top-performers-list">
            {insights.topPerformers.map((student, idx) => (
              <div key={student._id} className="performer-item">
                <div className="performer-rank">#{idx + 1}</div>
                <div className="performer-info">
                  <strong>{student.name}</strong>
                  <small>{student.department}</small>
                </div>
                <div className="performer-score">
                  <span className="score-value">{student.percentage || 0}%</span>
                  <span className={`status-badge ${student.passStatus?.toLowerCase()}`}>
                    {student.passStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {insights.bestDept && (
          <div className="insight-card">
            <div className="card-header">
              <TrendingUp size={20} />
              <h3>Department Leader</h3>
            </div>
            <div className="dept-leader">
              <div className="leader-badge">
                <Award size={32} />
              </div>
              <div className="leader-info">
                <h4>{insights.bestDept.name}</h4>
                <div className="leader-stats">
                  <div className="leader-stat">
                    <span className="stat-label">Pass Rate</span>
                    <span className="stat-value">{insights.bestDept.passRate.toFixed(1)}%</span>
                  </div>
                  <div className="leader-stat">
                    <span className="stat-label">Avg Score</span>
                    <span className="stat-value">{insights.bestDept.avgPct.toFixed(1)}%</span>
                  </div>
                  <div className="leader-stat">
                    <span className="stat-label">Students</span>
                    <span className="stat-value">{insights.bestDept.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="insight-card full-width">
          <div className="card-header">
            <BarChart3 size={20} />
            <h3>Department Breakdown</h3>
          </div>
          <div className="dept-breakdown">
            {Object.entries(insights.deptStats).map(([dept, stats]) => (
              <div key={dept} className="dept-item">
                <div className="dept-header">
                  <span className="dept-name">{dept}</span>
                  <span className="dept-count">{stats.total} students</span>
                </div>
                <div className="dept-metrics">
                  <div className="metric">
                    <span className="metric-label">Pass Rate</span>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{ width: `${stats.passRate}%` }}
                      ></div>
                      <span className="metric-value">{stats.passRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Avg Score</span>
                    <span className="metric-value">{stats.avgPct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

