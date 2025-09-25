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

  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const monitorData = await getMonitor(id);
        setMonitor(monitorData);

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

  if (loading)
    return (
      <div className="text-center py-8 text-gray-600">Loading metrics...</div>
    );
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!monitor)
    return <div className="text-center py-8">Monitor not found.</div>;

  if (metrics.length === 0) {
    return (
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <Link
            to="/metrics"
            className="btn-secondary w-full sm:w-auto text-center"
          >
            ← All Metrics
          </Link>
          <Link
            to={`/monitors/${monitor.id}`}
            className="btn-secondary w-full sm:w-auto text-center"
          >
            Back to Monitor
          </Link>
        </div>
        <div className="text-gray-500 text-center sm:text-left">
          No metrics available for this monitor yet.
        </div>
      </div>
    );
  }

  const topMetrics = [...metrics]
    .sort((a, b) => b.response_ms - a.response_ms)
    .slice(0, 10);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 space-y-8">
      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <Link
          to="/metrics"
          className="btn-secondary w-full sm:w-auto text-center"
        >
          ← All Metrics
        </Link>
        <Link
          to={`/monitors/${monitor.id}`}
          className="btn-secondary w-full sm:w-auto text-center"
        >
          Back to Monitor
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">
        Detailed metrics summary for{" "}
        <span className="text-[var(--primary)]">{monitor.name}</span>
      </h1>

      {/* Content split into 2-column layout on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 10 metrics table */}
        <div className="card bg-white shadow rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Top 10 Metrics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-xs sm:text-sm md:text-base">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b">
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left w-2/5">
                    Timestamp
                  </th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left w-1/4">
                    Latency (ms)
                  </th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 text-left w-1/4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {topMetrics.map((metric, idx) => (
                  <tr
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric)}
                    className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                      idx % 2 === 0 ? "bg-gray-50/30" : ""
                    }`}
                  >
                    <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                      {new Date(metric.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 sm:px-4">{metric.response_ms}</td>
                    <td className="py-2 px-3 sm:px-4">
                      {metric.is_up ? (
                        <span className="inline-block text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-green-200 text-green-800 font-medium">
                          UP
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-red-200 text-red-800 font-medium">
                          DOWN
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Metrics graph */}
        <div className="card bg-white shadow rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Metrics Over Time
          </h2>
          <div className="w-full h-56 sm:h-72 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metrics}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString()
                  }
                  minTickGap={25}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Line
                  type="monotone"
                  dataKey="response_ms"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metric details popup (unchanged) */}
      {selectedMetric && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-gray-900/60"
          onClick={() => setSelectedMetric(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMetric(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Metric Details
            </h3>
            <div className="space-y-2 text-sm sm:text-base">
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(selectedMetric.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Latency:</strong> {selectedMetric.response_ms} ms
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedMetric.is_up ? (
                  <span className="text-green-600 font-medium">UP</span>
                ) : (
                  <span className="text-red-600 font-medium">DOWN</span>
                )}
              </p>
              {selectedMetric.error && (
                <p>
                  <strong>Error:</strong>{" "}
                  <span className="text-red-500">{selectedMetric.error}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
