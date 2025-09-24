// src/pages/monitors/MetricsPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  listMetrics,
  type Metric,
  type Monitor,
  getMonitor,
} from "../../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MetricsPage() {
  const { id } = useParams<{ id: string }>();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Get monitor info
        const monitorData = await getMonitor(id);
        setMonitor(monitorData);

        // Fetch metrics, top 10
        const metricsData = await listMetrics({ monitor_id: id, limit: 100 });
        setMetrics(metricsData);
      } catch {
        setError("Failed to fetch metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading metrics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!monitor) return <div>Monitor not found.</div>;
  if (metrics.length === 0)
    return (
      <div className="text-gray-500">
        No metrics available for this monitor yet.
      </div>
    );

  // Top 10 metrics by latency (or value)
  const topMetrics = [...metrics]
    .sort((a, b) => b.response_ms - a.response_ms)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Metrics for{" "}
          <span className="text-[var(--primary)]">{monitor.name}</span>
        </h1>
        <Link to={`/monitors/${monitor.id}`} className="btn-secondary">
          Back to Monitor
        </Link>
      </div>

      {/* Top 10 metrics table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Top 10 Metrics</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Timestamp</th>
              <th className="py-2">Latency (ms)</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {topMetrics.map((metric) => (
              <tr key={metric.id} className="border-b">
                <td className="py-2">
                  {new Date(metric.timestamp).toLocaleString()}
                </td>
                <td className="py-2">{metric.response_ms}</td>
                <td className="py-2">
                  {metric.is_up ? (
                    <span className="badge badge-success">UP</span>
                  ) : (
                    <span className="badge badge-error">DOWN</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metrics graph */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Metrics Over Time</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metrics}
              margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="response_ms"
                stroke="var(--primary)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
