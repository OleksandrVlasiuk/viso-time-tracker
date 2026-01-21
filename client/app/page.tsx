"use client";
import { useState, useEffect } from "react";
import axios from "axios";


const API_URL = "https://urban-space-capybara-5xvprqgj4g92wqw-3000.app.github.dev/time-entry";
interface TimeEntry {
  id: number;
  date: string;
  project: string;
  hours: number;
  description: string;
}

const PROJECTS = ["Viso Internal", "Client A", "Client B", "Personal Development"];

export default function Home() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Початковий стан форми
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    project: PROJECTS[0],
    hours: 8,
    description: "",
  });

  const fetchEntries = async () => {
    try {
      const res = await axios.get(API_URL);
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(API_URL, {
        ...formData,
        hours: Number(formData.hours),
        date: new Date(formData.date).toISOString(),
      });
      
      await fetchEntries();
      setFormData({ ...formData, description: "", hours: 8 });
      alert("Saved successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const totalHours = entries.reduce((sum, item) => sum + item.hours, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          ⏱️ Viso Time Tracker
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">New Entry</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                >
                  {PROJECTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hours</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded text-white font-bold transition
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? "Saving..." : "Save Entry"}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold">History</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Total: {totalHours}h
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {entries.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No entries yet.</p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="border p-3 rounded hover:bg-gray-50 transition">
                    <div className="flex justify-between text-sm font-bold text-gray-700">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="text-blue-600">{entry.hours}h</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{entry.project}</div>
                    <p className="text-sm text-gray-800">{entry.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}