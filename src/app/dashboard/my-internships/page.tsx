"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseWithAuth } from "@/lib/supabase";
import Link from "next/link";

export default function MyInternshipsPage() {
  const { user } = useAuth();
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      if (!user) return;
      const supabase = await getSupabaseWithAuth();

      const { data, error } = await supabase
        .from("internships")
        .select("*, applications(count)")
        .eq("company_id", user.uid)
        .order("created_at", { ascending: false });

      if (!error) setInternships(data || []);
      setLoading(false);
    };
    fetchInternships();
  }, [user]);

  const deleteInternship = async (id: string) => {
    const supabase = await getSupabaseWithAuth();
    await supabase.from("internships").delete().eq("id", id);
    setInternships((prev) => prev.filter((i) => i.id !== id));
  };

  const updateInternship = async (id: string, updates: any) => {
    const supabase = await getSupabaseWithAuth();
    const { data, error } = await supabase
      .from("internships")
      .update(updates)
      .eq("id", id)
      .select();
    if (!error && data) {
      setInternships((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...data[0] } : i))
      );
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!user) return <p className="text-center mt-6">Please login first</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Internships</h2>

      {internships.length === 0 ? (
        <p className="text-gray-600">You haven’t posted any internships yet.</p>
      ) : (
        internships.map((internship) => (
          <div
            key={internship.id}
            className="border rounded p-4 mb-4 bg-white shadow"
          >
            {/* 🔗 Link to Internship Detail Page */}
            <Link
              href={`/dashboard/my-internships/${internship.id}`}
              className="block"
            >
              <h3 className="font-semibold hover:underline cursor-pointer text-lg">
                {internship.title}
              </h3>
            </Link>

            <p className="text-gray-500">{internship.location}</p>
            <p className="text-sm text-gray-600 mt-1">
              {internship.description}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Applicants: {internship.applications?.length || 0}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  updateInternship(internship.id, {
                    title:
                      prompt("New Title", internship.title) ||
                      internship.title,
                    description:
                      prompt("New Description", internship.description) ||
                      internship.description,
                    location:
                      prompt("New Location", internship.location) ||
                      internship.location,
                  })
                }
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteInternship(internship.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
