export const exportJSON = (data, filename = 'students.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportCSV = (items, filename = 'students.csv') => {
  if (!items || items.length === 0) return;
  const headers = ['Name','USN','Department','Email','Phone','Gender','DOB','Enrollment','Mathematics','Physics','Chemistry','English','ComputerScience','Percentage','Grade','PassStatus'];
  const rows = items.map(s => [
    s.name, s.usn, s.department, s.email||'', s.phone||'', s.gender||'',
    s.dob ? new Date(s.dob).toISOString().substring(0,10) : '',
    s.enrollmentDate ? new Date(s.enrollmentDate).toISOString().substring(0,10) : '',
    s.subjects?.mathematics ?? 0,
    s.subjects?.physics ?? 0,
    s.subjects?.chemistry ?? 0,
    s.subjects?.english ?? 0,
    s.subjects?.computerScience ?? 0,
    s.percentage ?? 0,
    s.grade ?? '',
    s.passStatus ?? ''
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const importJSON = async (file) => {
  const text = await file.text();
  return JSON.parse(text);
};

export const importCSV = async (file) => {
  const text = await file.text();
  const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
  const headers = headerLine.split(',').map(h => h.replace(/^"|"$/g,''));
  const idx = (name) => headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
  const out = lines.map(line => {
    const cols = line.match(/((?:^|,)(?:\"(?:[^\"]|\")*\"|[^,]*))/g).map(s => s.replace(/^,?\"|\"$/g,''));
    const get = (name) => cols[idx(name)] || '';
    return {
      name: get('Name'),
      usn: get('USN'),
      department: get('Department'),
      email: get('Email'),
      phone: get('Phone'),
      gender: get('Gender'),
      dob: get('DOB') || null,
      enrollmentDate: get('Enrollment') || null,
      subjects: {
        mathematics: Number(get('Mathematics')||0),
        physics: Number(get('Physics')||0),
        chemistry: Number(get('Chemistry')||0),
        english: Number(get('English')||0),
        computerScience: Number(get('ComputerScience')||0)
      }
    };
  });
  return out;
};


