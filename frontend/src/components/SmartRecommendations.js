import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, Users, Target, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { getAttendancePct } from '../utils/attendance';

const RECOMMENDATION_TYPES = {
  intervention: { icon: <AlertCircle size={18} />, color: 'rose', priority: 'high' },
  improvement: { icon: <TrendingUp size={18} />, color: 'amber', priority: 'medium' },
  opportunity: { icon: <Target size={18} />, color: 'emerald', priority: 'low' },
  action: { icon: <CheckCircle2 size={18} />, color: 'blue', priority: 'medium' }
};

export default function SmartRecommendations({ students = [], attendanceData = {}, onAction }) {
  const recommendations = useMemo(() => {
    if (!students.length) {
      return [
        {
          id: 'welcome',
          type: 'opportunity',
          title: 'Get Started',
          description: 'Add your first student to unlock personalized recommendations',
          action: 'Add Student',
          actionable: false
        }
      ];
    }

    const recs = [];
    const total = students.length;
    const failing = students.filter((s) => s.passStatus === 'Fail');
    const lowAttendance = students.filter((s) => getAttendancePct(attendanceData, s._id) < 70);
    const highPerformers = students.filter((s) => (s.percentage ?? 0) >= 85);
    const avgScore = students.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / total;
    const avgAttendance = students.reduce((sum, s) => sum + getAttendancePct(attendanceData, s._id), 0) / total;

    // High priority: Intervention needed
    if (failing.length > 0) {
      recs.push({
        id: 'intervention-failing',
        type: 'intervention',
        title: `${failing.length} Student${failing.length > 1 ? 's' : ''} Need Immediate Support`,
        description: `${failing.length} student${failing.length > 1 ? 's are' : ' is'} currently failing. Schedule intervention meetings this week.`,
        action: 'View At-Risk Students',
        actionable: true,
        data: { filter: 'failed' }
      });
    }

    if (lowAttendance.length > 0) {
      recs.push({
        id: 'intervention-attendance',
        type: 'intervention',
        title: `Attendance Alert: ${lowAttendance.length} Student${lowAttendance.length > 1 ? 's' : ''}`,
        description: `${lowAttendance.length} student${lowAttendance.length > 1 ? 's have' : ' has'} attendance below 70%. Send reminders and schedule check-ins.`,
        action: 'Review Attendance',
        actionable: true,
        data: { filter: 'low-attendance' }
      });
    }

    // Medium priority: Improvement opportunities
    if (avgScore < 70) {
      recs.push({
        id: 'improvement-score',
        type: 'improvement',
        title: 'Cohort Average Below Target',
        description: `Average score is ${avgScore.toFixed(1)}%. Focus on targeted tutoring and study groups to lift performance.`,
        action: 'View Analytics',
        actionable: true,
        data: { tab: 'analytics' }
      });
    }

    if (avgAttendance < 80) {
      recs.push({
        id: 'improvement-attendance',
        type: 'improvement',
        title: 'Attendance Needs Attention',
        description: `Average attendance is ${avgAttendance.toFixed(1)}%. Consider implementing attendance incentives or engagement programs.`,
        action: 'View Attendance',
        actionable: true,
        data: { tab: 'attendance' }
      });
    }

    // Low priority: Opportunities
    if (highPerformers.length >= 3) {
      recs.push({
        id: 'opportunity-mentors',
        type: 'opportunity',
        title: 'Peer Mentoring Opportunity',
        description: `${highPerformers.length} high-performing students could mentor struggling peers. Set up peer learning groups.`,
        action: 'Create Mentor Pairs',
        actionable: true,
        data: { action: 'mentor-pairs' }
      });
    }

    const deptStats = students.reduce((acc, s) => {
      if (!s.department) return acc;
      acc[s.department] = acc[s.department] || { count: 0, total: 0 };
      acc[s.department].count += 1;
      acc[s.department].total += s.percentage ?? 0;
      return acc;
    }, {});

    const deptWithLowAvg = Object.entries(deptStats).find(([_, stats]) => {
      const avg = stats.total / stats.count;
      return avg < 65 && stats.count >= 5;
    });

    if (deptWithLowAvg) {
      recs.push({
        id: 'opportunity-department',
        type: 'opportunity',
        title: `${deptWithLowAvg[0]} Needs Focus`,
        description: `Average score in ${deptWithLowAvg[0]} is ${(deptWithLowAvg[1].total / deptWithLowAvg[1].count).toFixed(1)}%. Consider department-specific interventions.`,
        action: 'View Department',
        actionable: true,
        data: { filter: 'department', value: deptWithLowAvg[0] }
      });
    }

    // Action items
    const studentsWithoutAttendance = students.filter((s) => {
      const record = attendanceData?.[s._id] || {};
      return Object.keys(record).length === 0;
    });

    if (studentsWithoutAttendance.length > 0) {
      recs.push({
        id: 'action-attendance',
        type: 'action',
        title: 'Update Attendance Records',
        description: `${studentsWithoutAttendance.length} student${studentsWithoutAttendance.length > 1 ? 's' : ''} missing attendance data. Update records for complete insights.`,
        action: 'Update Attendance',
        actionable: true,
        data: { tab: 'attendance' }
      });
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[RECOMMENDATION_TYPES[a.type].priority] - priorityOrder[RECOMMENDATION_TYPES[b.type].priority];
    });
  }, [students, attendanceData]);

  const handleAction = (rec) => {
    if (onAction) {
      onAction(rec);
    }
  };

  return (
    <div className="smart-recommendations">
      <header>
        <div>
          <p className="section-eyebrow mb-1">Smart Recommendations</p>
          <h3>AI-powered suggestions</h3>
        </div>
        <div className="rec-badge">
          <Lightbulb size={16} />
          {recommendations.length} Active
        </div>
      </header>

      <div className="recommendations-grid">
        {recommendations.map((rec) => {
          const typeConfig = RECOMMENDATION_TYPES[rec.type];
          return (
            <div key={rec.id} className={`recommendation-card is-${typeConfig.color}`}>
              <div className="rec-header">
                <div className="rec-icon">{typeConfig.icon}</div>
                <div className="rec-priority">{typeConfig.priority}</div>
              </div>
              <h4>{rec.title}</h4>
              <p>{rec.description}</p>
              {rec.actionable && (
                <button
                  type="button"
                  className="rec-action-btn"
                  onClick={() => handleAction(rec)}
                >
                  {rec.action}
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <div className="rec-empty">
          <CheckCircle2 size={32} />
          <p>All systems optimal! No recommendations at this time.</p>
        </div>
      )}
    </div>
  );
}

