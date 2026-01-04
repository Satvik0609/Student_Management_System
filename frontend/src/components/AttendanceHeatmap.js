import React, { useMemo } from 'react';
import { Calendar, TrendingUp, Users, Clock } from 'lucide-react';

export default function AttendanceHeatmap({ students = [], attendanceData = {} }) {
  const heatmapData = useMemo(() => {
    if (!students.length) return null;

    // Generate last 30 days
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate()
      });
    }

    // Calculate attendance for each day
    const dayStats = days.map(day => {
      let present = 0;
      let total = 0;

      students.forEach(student => {
        const studentAtt = attendanceData[student._id] || {};
        const dayAtt = studentAtt[day.date];
        if (dayAtt !== undefined) {
          total++;
          if (dayAtt === true || dayAtt === 'present') {
            present++;
          }
        }
      });

      return {
        ...day,
        present,
        total,
        percentage: total > 0 ? (present / total) * 100 : 0
      };
    });

    // Overall stats
    const totalDays = dayStats.length;
    const avgAttendance = dayStats.reduce((sum, d) => sum + d.percentage, 0) / totalDays;
    const bestDay = dayStats.reduce((best, day) => 
      day.percentage > best.percentage ? day : best
    , dayStats[0]);
    const worstDay = dayStats.reduce((worst, day) => 
      day.percentage < worst.percentage ? day : worst
    , dayStats[0]);

    // Weekly pattern
    const weeklyPattern = {
      Monday: { total: 0, present: 0 },
      Tuesday: { total: 0, present: 0 },
      Wednesday: { total: 0, present: 0 },
      Thursday: { total: 0, present: 0 },
      Friday: { total: 0, present: 0 },
      Saturday: { total: 0, present: 0 },
      Sunday: { total: 0, present: 0 }
    };

    dayStats.forEach(day => {
      const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (weeklyPattern[dayName]) {
        weeklyPattern[dayName].total += day.total;
        weeklyPattern[dayName].present += day.present;
      }
    });

    Object.keys(weeklyPattern).forEach(day => {
      const stats = weeklyPattern[day];
      stats.percentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
    });

    return {
      days: dayStats,
      avgAttendance,
      bestDay,
      worstDay,
      weeklyPattern
    };
  }, [students, attendanceData]);

  const getHeatColor = (percentage) => {
    if (percentage >= 90) return '#10b981'; // green
    if (percentage >= 75) return '#84cc16'; // lime
    if (percentage >= 60) return '#f59e0b'; // amber
    if (percentage >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  if (!heatmapData) {
    return (
      <div className="attendance-heatmap">
        <div className="empty-state">
          <Calendar size={48} />
          <p>Add students and attendance data to see heatmap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-heatmap">
      <div className="heatmap-header">
        <div className="header-title">
          <Calendar size={28} />
          <h2>Attendance Heatmap</h2>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <TrendingUp size={18} />
            <span>Avg: {heatmapData.avgAttendance.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <Users size={18} />
            <span>Best: {heatmapData.bestDay.dayName} ({heatmapData.bestDay.percentage.toFixed(0)}%)</span>
          </div>
          <div className="stat-item">
            <Clock size={18} />
            <span>Worst: {heatmapData.worstDay.dayName} ({heatmapData.worstDay.percentage.toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      <div className="heatmap-content">
        <div className="heatmap-calendar">
          <div className="calendar-header">
            <span>Last 30 Days</span>
          </div>
          <div className="calendar-grid">
            {heatmapData.days.map((day, idx) => (
              <div
                key={day.date}
                className="calendar-day"
                style={{
                  backgroundColor: getHeatColor(day.percentage),
                  opacity: day.total > 0 ? 1 : 0.3
                }}
                title={`${day.dayName}, ${day.dayNum}: ${day.percentage.toFixed(0)}% (${day.present}/${day.total})`}
              >
                <span className="day-num">{day.dayNum}</span>
                <span className="day-percent">{day.total > 0 ? `${day.percentage.toFixed(0)}%` : '-'}</span>
              </div>
            ))}
          </div>
          <div className="calendar-legend">
            <span>Less</span>
            <div className="legend-gradient"></div>
            <span>More</span>
          </div>
        </div>

        <div className="weekly-pattern">
          <h3>Weekly Pattern</h3>
          <div className="pattern-bars">
            {Object.entries(heatmapData.weeklyPattern).map(([day, stats]) => (
              <div key={day} className="pattern-bar-item">
                <div className="bar-header">
                  <span className="day-label">{day.substring(0, 3)}</span>
                  <span className="day-percent">{stats.percentage.toFixed(0)}%</span>
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${stats.percentage}%`,
                      backgroundColor: getHeatColor(stats.percentage)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

