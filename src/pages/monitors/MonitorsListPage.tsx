// src/pages/monitors/MonitorsListPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listMonitors, deleteMonitor, type Monitor } from "../../services/api";

export default function MonitorsListPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      setDeletingId(id);
      await deleteMonitor(id);
      await fetchMonitors();
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-b-2 border-[var(--primary)] rounded-full"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Monitors</h1>
        <Link
          to="/monitors/create"
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-medium shadow hover:bg-[var(--primary-dark)] transition"
        >
          + Create Monitor
        </Link>
      </div>

      {/* Monitors Grid */}
      {monitors.length === 0 ? (
        <div className="text-center py-20 p-10 bg-gray-50 rounded-xl shadow-inner">
          <p className="text-lg text-gray-600 mb-4">
            No monitors yet. Create your first one!
          </p>
          <Link
            to="/monitors/create"
            className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition"
          >
            Create Monitor
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {monitors.map((monitor) => (
            <div
              key={monitor.id}
              className="bg-white shadow hover:shadow-lg transition rounded-xl p-5 flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                  {monitor.name}
                  <span
                    className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      monitor.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {monitor.is_active ? "Active" : "Inactive"}
                  </span>
                </h2>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {monitor.url}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Frequency: {monitor.frequency_sec}s
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/monitors/${monitor.id}`}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm text-center border border-gray-200 hover:bg-gray-100 transition"
                >
                  View
                </Link>
                <Link
                  to={`/monitors/${monitor.id}/edit`}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm text-center border border-gray-200 hover:bg-gray-100 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(monitor.id)}
                  disabled={deletingId === monitor.id}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm text-white ${
                    deletingId === monitor.id
                      ? "bg-red-300 cursor-wait"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deletingId === monitor.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
