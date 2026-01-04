import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Settings } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getAttendancePct } from '../utils/attendance';

const CHART_TYPES = [
  { id: 'bar', label: 'Bar Chart', icon: <BarChart3 size={18} /> },
  { id: 'pie', label: 'Pie Chart', icon: <PieChart size={18} /> },
  { id: 'line', label: 'Line Chart', icon: <TrendingUp size={18} /> },
  { id: 'radar', label: 'Radar Chart', icon: <BarChart3 size={18} /> }
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function VisualizationStudio({ students = [], attendanceData = {}, onExport }) {
  const [chartType, setChartType] = useState('bar');
  const [metric, setMetric] = useState('department');

  const chartData = useMemo(() => {
    if (!students.length) return [];

    if (metric === 'department') {
      const deptStats = students.reduce((acc, s) => {
        if (!s.department) return acc;
        acc[s.department] = acc[s.department] || { count: 0, total: 0 };
        acc[s.department].count += 1;
        acc[s.department].total += s.percentage ?? 0;
        return acc;
      }, {});
      return Object.entries(deptStats).map(([name, stats]) => ({
        name: name.length > 12 ? name.substring(0, 12) : name,
        value: Math.round(stats.total / stats.count),
        count: stats.count
      })).sort((a, b) => b.value - a.value);
    }

    if (metric === 'grade') {
      const gradeStats = students.reduce((acc, s) => {
        const grade = s.grade || 'NA';
        acc[grade] = acc[grade] || 0;
        acc[grade] += 1;
        return acc;
      }, {});
      return Object.entries(gradeStats).map(([name, count]) => ({
        name,
        value: count
      }));
    }

    if (metric === 'attendance') {
      const ranges = [
        { name: '90-100%', min: 90, max: 100 },
        { name: '75-89%', min: 75, max: 89 },
        { name: '60-74%', min: 60, max: 74 },
        { name: '<60%', min: 0, max: 59 }
      ];
      return ranges.map((range) => {
        const count = students.filter((s) => {
          const pct = getAttendancePct(attendanceData, s._id);
          return pct >= range.min && pct <= range.max;
        }).length;
        return { name: range.name, value: count };
      });
    }

    if (metric === 'performance') {
      const ranges = [
        { name: '90-100%', min: 90, max: 100 },
        { name: '75-89%', min: 75, max: 89 },
        { name: '60-74%', min: 60, max: 74 },
        { name: '<60%', min: 0, max: 59 }
      ];
      return ranges.map((range) => {
        const count = students.filter((s) => {
          const pct = s.percentage ?? 0;
          return pct >= range.min && pct <= range.max;
        }).length;
        return { name: range.name, value: count };
      });
    }

    return [];
  }, [students, attendanceData, metric]);

  const renderChart = () => {
    if (!chartData.length) {
      return <div className="chart-empty">No data available for selected metric.</div>;
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" name={metric === 'department' ? 'Avg Score' : 'Count'} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'radar':
        const radarData = chartData.slice(0, 6).map((item) => ({
          subject: item.name,
          value: item.value,
          fullMark: Math.max(...chartData.map((d) => d.value))
        }));
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" stroke="#64748b" />
              <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} stroke="#64748b" />
              <Radar name="Value" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport('visualization-data.json', {
        chartType,
        metric,
        data: chartData,
        generatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="visualization-studio">
      <header>
        <div>
          <p className="section-eyebrow mb-1">Visualization Studio</p>
          <h3>Advanced data visualization</h3>
        </div>
        <button className="export-btn" onClick={handleExport}>
          <Download size={16} />
          Export Data
        </button>
      </header>

      <div className="studio-controls">
        <div className="control-group">
          <label>
            <Settings size={16} />
            Chart Type
          </label>
          <div className="chart-type-selector">
            {CHART_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className={chartType === type.id ? 'active' : ''}
                onClick={() => setChartType(type.id)}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>
            <BarChart3 size={16} />
            Metric
          </label>
          <select value={metric} onChange={(e) => setMetric(e.target.value)} className="metric-select">
            <option value="department">Department Performance</option>
            <option value="grade">Grade Distribution</option>
            <option value="attendance">Attendance Ranges</option>
            <option value="performance">Performance Ranges</option>
          </select>
        </div>
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>

      <div className="chart-info">
        <p>
          <strong>Data Points:</strong> {chartData.length} | <strong>Total Students:</strong> {students.length}
        </p>
      </div>
    </div>
  );
}

