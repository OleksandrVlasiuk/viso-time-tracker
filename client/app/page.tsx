"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// 👇 ТВОЄ ПОСИЛАННЯ
const API_URL = "https://urban-space-capybara-5xvprqgj4g92wqw-3000.app.github.dev/time-entry";

interface TimeEntry {
  id: number;
  date: string;
  project: string;
  hours: number;
  description: string;
}

interface GroupedEntries {
  date: string;
  totalHours: number;
  entries: TimeEntry[];
}

const PROJECTS = ["Viso Internal", "Client A", "Client B", "Personal Development"];

export default function Home() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<{
    date: string;
    project: string;
    hours: number | string;
    description: string;
  }>({
    date: new Date().toISOString().split("T")[0],
    project: PROJECTS[0],
    hours: 8,
    description: "",
  });

  const fetchEntries = async () => {
    try {
      const res = await axios.get(API_URL);
      // Сортуємо: нові дати зверху
      const sortedData = res.data.sort((a: TimeEntry, b: TimeEntry) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEntries(sortedData);
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
    } catch (err: any) {
      setError(err.response?.data?.message || "Error saving data");
    } finally {
      setLoading(false);
    }
  };

  // 1. Рахуємо загальну суму (Grand Total)
  const grandTotal = entries.reduce((sum, item) => sum + item.hours, 0);

  // 2. Логіка ГРУПУВАННЯ по датах
  const groupedEntries: GroupedEntries[] = Object.values(
    entries.reduce((acc, entry) => {
      // Отримуємо чисту дату "YYYY-MM-DD" для ключа
      const dateKey = new Date(entry.date).toISOString().split("T")[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = { date: entry.date, totalHours: 0, entries: [] };
      }
      
      acc[dateKey].entries.push(entry);
      acc[dateKey].totalHours += entry.hours;
      
      return acc;
    }, {} as Record<string, GroupedEntries>)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Сортуємо групи за датою

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-900 flex justify-center items-start">
      <div className="w-full max-w-lg space-y-6">
        
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight mb-1">
            Viso Time Tracker
          </h1>
          <p className="text-sm text-slate-500">
            Compact Mode
          </p>
        </div>

        {/* ✏️ FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
          <div className="bg-indigo-600 px-5 py-3">
            <h2 className="text-white text-base font-bold flex items-center gap-2">
              <span>✏️</span> New Entry
            </h2>
          </div>
          
          <div className="p-5">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Date</label>
                  <input
                    type="date"
                    required
                    className="block w-full rounded-lg border-slate-300 bg-slate-50 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    required
                    className="block w-full rounded-lg border-slate-300 bg-slate-50 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                    value={formData.hours}
                    onChange={(e) => {
                       const val = e.target.value;
                       setFormData({ ...formData, hours: val === "" ? "" : Number(val) });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Project</label>
                <select
                  className="block w-full rounded-lg border-slate-300 bg-slate-50 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                >
                  {PROJECTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Description</label>
                <textarea
                  required
                  rows={2}
                  className="block w-full rounded-lg border-slate-300 bg-slate-50 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                  placeholder="Task details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white shadow-md transition-all
                  ${loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5"}`}
              >
                {loading ? "Saving..." : "Save Entry"}
              </button>
            </form>
          </div>
        </div>

        {/* 📅 HISTORY LIST (GROUPED) */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
          <div className="bg-slate-800 px-5 py-3 flex justify-between items-center">
            <h2 className="text-white text-base font-bold">📅 History</h2>
            <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Grand Total: {grandTotal}h
            </span>
          </div>

          <div className="p-0 overflow-y-auto max-h-[500px] bg-slate-50">
            {groupedEntries.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm">
                No entries yet.
              </div>
            ) : (
              // Рендеримо групи
              <div className="divide-y divide-slate-200">
                {groupedEntries.map((group) => (
                  <div key={group.date} className="bg-white">
                    {/* 👇 ЗАГОЛОВОК ГРУПИ (ДАТА + СУМА ЗА ДЕНЬ) */}
                    <div className="bg-slate-100 px-4 py-2 flex justify-between items-center border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        {new Date(group.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Day Total: {group.totalHours}h
                      </span>
                    </div>

                    {/* СПИСОК ЗАПИСІВ У ЦІЙ ГРУПІ */}
                    <div className="divide-y divide-slate-100">
                      {group.entries.map((entry) => (
                        <div key={entry.id} className="p-4 hover:bg-slate-50 transition flex gap-3">
                           {/* Content */}
                           <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="text-sm font-bold text-slate-800 truncate">{entry.project}</h3>
                              <span className="text-xs font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                {entry.hours}h
                              </span>
                            </div>
                            <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                              {entry.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}