"use client";

import { useEffect, useState } from "react";
import { getSupabaseWithAuth } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function CompanyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      if (!user) return;
      const supabase = await getSupabaseWithAuth();
      const { data } = await supabase
        .from("applications")
        .select("*, internships(title), users(full_name, email)")
        .order("created_at", { ascending: false });
      setApplications(data || []);
    };
    fetchApps();
  }, [user]);

  const updateStatus = async (appId: string, status: string) => {
    const supabase = await getSupabaseWithAuth();
    await supabase.from("applications").update({ status }).eq("id", appId);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Applications</h2>
      {applications.map((app) => (
        <div
          key={app.id}
          className="border p-4 rounded mb-4 bg-white shadow"
        >
          <h3 className="font-semibold">
            {app.users?.full_name} → {app.internships?.title}
          </h3>
          <p>{app.users?.email}</p>
          {app.resume_url && (
            <a
              href={app.resume_url}
              target="_blank"
              className="text-blue-600 underline"
            >
              View Resume
            </a>
          )}
          <p className="mt-2">{app.cover_letter}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => updateStatus(app.id, "accepted")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => updateStatus(app.id, "rejected")}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
            <span
              className={`ml-4 text-sm ${
                app.status === "accepted"
                  ? "text-green-600"
                  : app.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {app.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
