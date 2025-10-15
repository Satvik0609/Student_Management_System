import React, { useMemo } from 'react';
import { Card, CardBody } from './_primitives';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#28a745', '#dc3545', '#0d6efd', '#ffc107', '#6610f2', '#20c997'];

const Dashboard = ({ items }) => {
  const kpis = useMemo(() => {
    const count = items.length;
    const avg = count ? (items.reduce((s, x) => s + (x.percentage || 0), 0) / count).toFixed(2) : 0;
    const top = items.slice().sort((a,b) => (b.percentage||0) - (a.percentage||0))[0] || null;
    return { count, avg, top };
  }, [items]);

  const deptData = useMemo(() => {
    const map = new Map();
    items.forEach((s) => map.set(s.department, (map.get(s.department) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [items]);

  const passFail = useMemo(() => {
    const pass = items.filter(i => i.passStatus === 'Pass').length;
    const fail = items.length - pass;
    return [
      { name: 'Pass', value: pass },
      { name: 'Fail', value: fail }
    ];
  }, [items]);

  const gradeDist = useMemo(() => {
    const grades = ['A+','A','B+','B','C','F'];
    const counts = grades.map(g => ({ name: g, value: items.filter(i => i.grade === g).length }));
    return counts;
  }, [items]);

  return (
    <div className="row g-3 mb-3">
      <div className="col-md-3">
        <div className="card text-center">
          <div className="card-body">
            <div className="fw-bold">Total Students</div>
            <div className="display-6">{kpis.count}</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card text-center">
          <div className="card-body">
            <div className="fw-bold">Average %</div>
            <div className="display-6">{kpis.avg}</div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <div className="fw-bold mb-2">Top Performer</div>
            {kpis.top ? (
              <div className="d-flex justify-content-between">
                <div>{kpis.top.name} ({kpis.top.usn})</div>
                <div>{kpis.top.percentage}% • {kpis.top.grade}</div>
              </div>
            ) : (
              <div>No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card" style={{ height: 280 }}>
          <div className="card-body">
            <div className="fw-bold mb-2">Department Distribution</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptData}>
                <XAxis dataKey="name" hide={deptData.length === 0} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0d6efd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card" style={{ height: 280 }}>
          <div className="card-body">
            <div className="fw-bold mb-2">Pass/Fail Ratio</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={passFail} innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" label>
                  {passFail.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#28a745' : '#dc3545'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card" style={{ height: 300 }}>
          <div className="card-body">
            <div className="fw-bold mb-2">Grade Distribution</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={gradeDist}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value">
                  {gradeDist.map((entry, index) => (
                    <Cell key={`cell-g-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


