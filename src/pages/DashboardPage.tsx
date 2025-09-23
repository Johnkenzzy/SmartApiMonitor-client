// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { getMe, type User } from "../services/api";

export function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getMe();
        setUser(data);
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to load user data."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--text)]">Dashboard</h1>

        {loading && <p className="text-gray-500">Loading your info...</p>}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Active:</strong>{" "}
                {user.is_active? "Yes" : "NO"}
              </p>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button className="btn">View Monitors</button>
                <button className="btn">Create Monitor</button>
                <button className="btn">View Metrics</button>
                <button className="btn">View Alerts</button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default DashboardPage;
