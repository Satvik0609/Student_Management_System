export function getAttendancePct(attendanceData = {}, studentId) {
  if (!studentId) return 100;
  const record = attendanceData?.[studentId] || {};
  const values = Object.values(record);
  if (values.length === 0) return 100;
  const present = values.filter((value) => value === 'present').length;
  return Math.round((present / values.length) * 100);
}

