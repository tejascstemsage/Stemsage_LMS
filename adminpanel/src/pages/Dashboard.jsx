import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const StatCard = ({ label, value, icon }) => (
  <div className="stat-card">
    <div className="stat-card__icon">{icon}</div>
    <div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard/stats').then(({ data }) => {
      if (data.success) setStats(data.stats);
    });
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Overview of your STEM kit lending program</p>

      {!stats ? (
        <p>Loading stats...</p>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Total Schools" value={stats.total_schools} icon="🏫" />
            <StatCard label="Active Schools" value={stats.active_schools} icon="✅" />
            <StatCard label="Total Kits" value={stats.total_kits} icon="🧪" />
            <StatCard label="Total Assignments" value={stats.total_assignments} icon="🔗" />
          </div>

          <div className="panel-grid">
            <div className="panel">
              <h3>Kits by Subject</h3>
              {stats.by_subject.length === 0 && <p className="muted">No kits yet.</p>}
              {stats.by_subject.map((row) => (
                <div className="bar-row" key={row.subject}>
                  <span>{row.subject}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(row.count / stats.total_kits) * 100}%` }}
                    />
                  </div>
                  <span>{row.count}</span>
                </div>
              ))}
            </div>

            <div className="panel">
              <h3>Kits by Grade</h3>
              {stats.by_grade.length === 0 && <p className="muted">No kits yet.</p>}
              {stats.by_grade.map((row) => (
                <div className="bar-row" key={row.grade}>
                  <span>{row.grade}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(row.count / stats.total_kits) * 100}%` }}
                    />
                  </div>
                  <span>{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
