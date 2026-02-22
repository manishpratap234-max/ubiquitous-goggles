import { useEffect, useState } from 'react';
import { getStats } from '../services/api';

export function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, captains: 0, pendingDrivers: 0, liveRides: 0 });

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="layout">
      <header>
        <h1>Ride Platform Admin</h1>
        <p>Manage users, captains, pricing and live operations.</p>
      </header>
      <section className="grid">
        <StatCard label="Riders" value={stats.users} />
        <StatCard label="Captains" value={stats.captains} />
        <StatCard label="Pending Verifications" value={stats.pendingDrivers} />
        <StatCard label="Live Rides" value={stats.liveRides} />
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card">
      <h2>{label}</h2>
      <strong>{value}</strong>
    </div>
  );
}
