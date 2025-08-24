"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseWithAuth } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function InternshipDetailPage() {
  const { id } = useParams(); // internship id from URL
  const { user } = useAuth();
  const [internship, setInternship] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;
      const supabase = await getSupabaseWithAuth();

      // Fetch internship details
      const { data: internshipData } = await supabase
        .from("internships")
        .select("*")
        .eq("id", id)
        .single();

      setInternship(internshipData);

      // Fetch applications for this internship
      const { data: apps } = await supabase
        .from("applications")
        .select("*, users(full_name, email)")
        .eq("internship_id", id)
        .order("created_at", { ascending: false });

      setApplications(apps || []);
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  const updateStatus = async (appId: string, status: string) => {
    const supabase = await getSupabaseWithAuth();
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", appId);

    if (!error) {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!internship) return <p className="text-center mt-6">Internship not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">{internship.title}</h2>
      <p className="text-gray-600">{internship.description}</p>
      <p className="text-gray-500 mb-6">{internship.location}</p>

      <h3 className="text-xl font-semibold mb-4">Applications</h3>

      {applications.length === 0 ? (
        <p className="text-gray-600">No applications yet.</p>
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            className="border p-4 rounded mb-4 bg-white shadow"
          >
            <h4 className="font-medium">{app.users?.full_name}</h4>
            <p className="text-sm text-gray-600">{app.users?.email}</p>

            {app.resume_url && (
              <a
                href={app.resume_url}
                target="_blank"
                className="text-blue-600 underline block mt-1"
              >
                View Resume
              </a>
            )}
            {app.cover_letter && (
              <p className="mt-2 text-sm">{app.cover_letter}</p>
            )}

            <div className="mt-3 flex gap-2 items-center">
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
        ))
      )}
    </div>
  );
}
