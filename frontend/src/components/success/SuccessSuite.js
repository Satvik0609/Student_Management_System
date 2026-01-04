import React from 'react';
import MentorHub from './MentorHub';
import JourneyTracker from './JourneyTracker';
import EngagementSurveys from './EngagementSurveys';
import ResourceStudio from './ResourceStudio';
import CareerLaunchpad from './CareerLaunchpad';
import GuardianPortal from './GuardianPortal';
import AchievementsBoard from './AchievementsBoard';
import AIAdvisor from './AIAdvisor';

export default function SuccessSuite({
  students = [],
  attendanceData = {},
  onExportJSON
}) {
  return (
    <div className="success-suite">
      <div className="success-grid triple">
        <MentorHub students={students} attendanceData={attendanceData} />
        <JourneyTracker students={students} attendanceData={attendanceData} />
        <EngagementSurveys students={students} onExport={onExportJSON} />
      </div>

      <div className="success-grid double">
        <ResourceStudio />
        <CareerLaunchpad />
      </div>

      <div className="success-grid double">
        <GuardianPortal
          students={students}
          attendanceData={attendanceData}
          onShare={onExportJSON}
        />
        <AchievementsBoard students={students} attendanceData={attendanceData} />
      </div>

      <div className="success-grid single">
        <AIAdvisor students={students} />
      </div>
    </div>
  );
}

