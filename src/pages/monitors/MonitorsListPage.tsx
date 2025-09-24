// src/pages/monitors/MonitorsListPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listMonitors, deleteMonitor, type Monitor } from "../../services/api";

export default function MonitorsListPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      const data = await listMonitors();
      setMonitors(data);
    } catch {
      setError("Failed to fetch monitors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this monitor?")) return;
    try {
      await deleteMonitor(id);
      fetchMonitors();
    } catch {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  if (loading) return <div>Loading monitors...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Monitors</h1>
        <Link to="/monitors/create" className="btn">
          Create Monitor
        </Link>
      </div>

      <div className="grid gap-4">
        {monitors.length === 0 && <div>No monitors found.</div>}
        {monitors.map((monitor) => (
          <div
            key={monitor.id}
            className="card flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{monitor.name}</div>
              <div className="text-sm text-gray-500">{monitor.url}</div>
              <div className="text-xs text-gray-400">
                Frequency: {monitor.frequency_sec}s | Status:{" "}
                {monitor.is_active ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/monitors/${monitor.id}`}
                className="btn-secondary text-sm"
              >
                View
              </Link>
              <Link
                to={`/monitors/${monitor.id}/edit`}
                className="btn-secondary text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(monitor.id)}
                className="btn btn-error text-sm bg-red-500 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
