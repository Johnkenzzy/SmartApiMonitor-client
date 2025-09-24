// src/pages/monitors/MonitorViewPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMonitor, type Monitor } from "../../services/api";

export default function MonitorViewPage() {
  const { id } = useParams<{ id: string }>();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchMonitor = async () => {
      try {
        const data = await getMonitor(id);
        setMonitor(data);
      } catch {
        setError("Failed to fetch monitor");
      } finally {
        setLoading(false);
      }
    };
    fetchMonitor();
  }, [id]);

  if (loading) return <div>Loading monitor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!monitor) return <div>Monitor not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{monitor.name}</h1>
        <Link to={`/monitors/${monitor.id}/edit`} className="btn">
          Edit Monitor
        </Link>
        <Link to={`/monitors/${monitor.id}/metrics`} className="btn">
          View Metrics
        </Link>
      </div>

      <div className="card space-y-2">
        <div>
          <strong>URL:</strong> {monitor.url}
        </div>
        <div>
          <strong>Frequency:</strong> {monitor.frequency_sec}s
        </div>
        <div>
          <strong>Status:</strong> {monitor.is_active ? "Active" : "Inactive"}
        </div>
        {monitor.max_latency_ms != null && (
          <div>
            <strong>Max Latency:</strong> {monitor.max_latency_ms} ms
          </div>
        )}
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(monitor.created_at).toLocaleString()}
        </div>
        <div>
          <strong>Updated At:</strong>{" "}
          {new Date(monitor.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
