// src/pages/monitors/MonitorUpdateForm.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMonitor, updateMonitor, type Monitor } from "../../services/api";

export default function MonitorUpdateForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monitor) return;

    try {
      await updateMonitor(monitor.id, monitor);
      navigate(`/monitors/${monitor.id}`);
    } catch {
      setError("Update failed");
    }
  };

  if (loading) return <div>Loading monitor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!monitor) return <div>Monitor not found.</div>;

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(`/monitors/${monitor.id}`)}
        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
      >
        ← Back to Monitor
      </button>

      <h1 className="text-2xl font-bold">Update Monitor</h1>
      {error && <div className="text-red-500">{error}</div>}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Name"
          value={monitor.name}
          onChange={(e) => setMonitor({ ...monitor, name: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="URL"
          type="url"
          value={monitor.url}
          onChange={(e) => setMonitor({ ...monitor, url: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Frequency (seconds)"
          type="number"
          value={monitor.frequency_sec}
          onChange={(e) =>
            setMonitor({ ...monitor, frequency_sec: Number(e.target.value) })
          }
          required
        />
        <input
          className="input"
          placeholder="Max Latency (ms)"
          type="number"
          value={monitor.max_latency_ms ?? ""}
          onChange={(e) =>
            setMonitor({
              ...monitor,
              max_latency_ms: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
        <div className="flex items-center gap-2">
          <label>
            <input
              type="checkbox"
              checked={monitor.is_active}
              onChange={(e) =>
                setMonitor({ ...monitor, is_active: e.target.checked })
              }
            />{" "}
            Active
          </label>
        </div>
        <button type="submit" className="btn w-full">
          Update Monitor
        </button>
      </form>
    </div>
  );
}
