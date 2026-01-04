import React, { useState, useMemo } from 'react';
import { Sparkles, Send, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

const QUERY_PATTERNS = [
  { pattern: /at.?risk|failing|low|poor/i, type: 'risk' },
  { pattern: /top|best|high|excellent|outstanding/i, type: 'excellence' },
  { pattern: /attendance|present|absent/i, type: 'attendance' },
  { pattern: /trend|improve|progress|growth/i, type: 'trend' },
  { pattern: /department|dept|major/i, type: 'department' },
  { pattern: /average|mean|median|stat/i, type: 'stats' }
];

export default function AIInsights({ students = [], attendanceData = {} }) {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);

  const insights = useMemo(() => {
    if (!query.trim() || !students.length) return null;

    const lowerQuery = query.toLowerCase();
    const matchedPattern = QUERY_PATTERNS.find(({ pattern }) => pattern.test(lowerQuery));

    if (matchedPattern?.type === 'risk') {
      const atRisk = students.filter((s) => (s.percentage ?? 0) < 60 || getAttendancePct(attendanceData, s._id) < 70);
      return {
        type: 'risk',
        title: 'At-Risk Students Identified',
        summary: `Found ${atRisk.length} students requiring immediate attention.`,
        data: atRisk.slice(0, 10).map((s) => ({
          name: s.name,
          score: `${s.percentage ?? 0}%`,
          attendance: `${getAttendancePct(attendanceData, s._id)}%`,
          department: s.department
        })),
        recommendation: 'Schedule intervention meetings and assign mentors.'
      };
    }

    if (matchedPattern?.type === 'excellence') {
      const top = students.slice().sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)).slice(0, 5);
      return {
        type: 'excellence',
        title: 'Top Performers',
        summary: `Highlighting ${top.length} highest-achieving students.`,
        data: top.map((s) => ({
          name: s.name,
          score: `${s.percentage ?? 0}%`,
          grade: s.grade,
          department: s.department
        })),
        recommendation: 'Consider leadership opportunities and peer mentoring roles.'
      };
    }

    if (matchedPattern?.type === 'attendance') {
      const lowAttendance = students.filter((s) => getAttendancePct(attendanceData, s._id) < 75);
      const avg = students.reduce((sum, s) => sum + getAttendancePct(attendanceData, s._id), 0) / students.length;
      return {
        type: 'attendance',
        title: 'Attendance Analysis',
        summary: `Average attendance: ${Math.round(avg)}%. ${lowAttendance.length} students below 75%.`,
        data: lowAttendance.slice(0, 8).map((s) => ({
          name: s.name,
          attendance: `${getAttendancePct(attendanceData, s._id)}%`,
          department: s.department
        })),
        recommendation: 'Send attendance reminders and schedule check-ins.'
      };
    }

    if (matchedPattern?.type === 'department') {
      const deptStats = students.reduce((acc, s) => {
        if (!s.department) return acc;
        acc[s.department] = acc[s.department] || { count: 0, total: 0 };
        acc[s.department].count += 1;
        acc[s.department].total += s.percentage ?? 0;
        return acc;
      }, {});
      const deptList = Object.entries(deptStats).map(([name, stats]) => ({
        name,
        avg: Math.round(stats.total / stats.count),
        count: stats.count
      })).sort((a, b) => b.avg - a.avg);
      return {
        type: 'department',
        title: 'Department Performance',
        summary: `${deptList.length} departments analyzed.`,
        data: deptList,
        recommendation: 'Focus resources on departments with lower averages.'
      };
    }

    return {
      type: 'general',
      title: 'General Insights',
      summary: 'Analyzing your query...',
      data: [],
      recommendation: 'Try queries like "show at-risk students" or "top performers".'
    };
  }, [query, students, attendanceData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || !insights) return;
    setHistory((prev) => [{ query, insights, timestamp: Date.now() }, ...prev.slice(0, 4)]);
    setQuery('');
  };

  return (
    <div className="ai-insights">
      <header>
        <div>
          <p className="section-eyebrow mb-1">AI-Powered Insights</p>
          <h3>Natural language queries</h3>
        </div>
        <div className="ai-badge">
          <Sparkles size={16} />
          Intelligent Analysis
        </div>
      </header>

      <form onSubmit={handleSubmit} className="ai-query-form">
        <div className="query-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask: 'Show me at-risk students' or 'Top performers by department'"
            className="query-input"
          />
          <button type="submit" className="query-submit" disabled={!query.trim()}>
            <Send size={18} />
          </button>
        </div>
        <div className="query-suggestions">
          <button type="button" onClick={() => setQuery('Show at-risk students')}>At-risk students</button>
          <button type="button" onClick={() => setQuery('Top performers')}>Top performers</button>
          <button type="button" onClick={() => setQuery('Attendance analysis')}>Attendance</button>
          <button type="button" onClick={() => setQuery('Department performance')}>Departments</button>
        </div>
      </form>

      {insights && (
        <div className={`insight-result is-${insights.type}`}>
          <div className="result-header">
            <div>
              {insights.type === 'risk' && <AlertTriangle size={20} />}
              {insights.type === 'excellence' && <TrendingUp size={20} />}
              {insights.type === 'attendance' && <Target size={20} />}
              {insights.type === 'department' && <Zap size={20} />}
              <h4>{insights.title}</h4>
            </div>
            <p className="result-summary">{insights.summary}</p>
          </div>
          {insights.data.length > 0 && (
            <div className="result-data">
              <table>
                <thead>
                  <tr>
                    {insights.type === 'risk' && (
                      <>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Attendance</th>
                        <th>Department</th>
                      </>
                    )}
                    {insights.type === 'excellence' && (
                      <>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Department</th>
                      </>
                    )}
                    {insights.type === 'attendance' && (
                      <>
                        <th>Name</th>
                        <th>Attendance</th>
                        <th>Department</th>
                      </>
                    )}
                    {insights.type === 'department' && (
                      <>
                        <th>Department</th>
                        <th>Avg Score</th>
                        <th>Students</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {insights.data.map((item, idx) => (
                    <tr key={idx}>
                      {Object.values(item).map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="result-recommendation">
            <strong>💡 Recommendation:</strong> {insights.recommendation}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="query-history">
          <p className="history-label">Recent queries</p>
          {history.map((item, idx) => (
            <div key={idx} className="history-item">
              <span className="history-query">"{item.query}"</span>
              <span className="history-result">{item.insights.summary}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

