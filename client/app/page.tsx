"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// 👇 НЕ ЗАБУДЬ ПЕРЕВІРИТИ СВОЄ ПОСИЛАННЯ ТУТ
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
  
  // Виправлення: hours тепер може бути рядком (""), поки ми друкуємо
  const [formData, setFormData] = useState<{
    date: string;
    project: string;
    hours: number | string; // Дозволяємо і число, і пустий рядок
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
        hours: Number(formData.hours), // Перед відправкою гарантуємо, що це число
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

  // Рахуємо суму (з перевіркою на число)
  const totalHours = entries.reduce((sum, item) => sum + item.hours, 0);

  return (
    // Використовуємо flex та items-center для ідеального центрування по вертикалі і горизонталі
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-500 flex justify-center items-start">
      
      {/* Зменшили ширину до max-w-4xl, щоб було компактніше і по центру */}
      <div className="w-full max-w-4xl">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight sm:text-5xl mb-2">
            Viso Time Tracker
          </h1>
          <p className="text-lg text-slate-600">
            Log your daily activities efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* 📝 LEFT COLUMN: FORM CARD */}
          {/* Змінили пропорції колонок: тепер 5/12 форма і 7/12 історія */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 sticky top-6">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-white text-lg font-bold flex items-center gap-2">
                  <span>✏️</span> New Entry
                </h2>
              </div>
              
              <div className="p-6">
                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm" role="alert">
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Date Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      className="block w-full rounded-lg border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  {/* Project Select */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Project</label>
                    <select
                      className="block w-full rounded-lg border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    >
                      {PROJECTS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hours Input (ВИПРАВЛЕНО) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Hours Worked</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0" // Дозволяємо 0 для зручності вводу, але бекенд не пропустить < 1
                        max="24"
                        required
                        className="block w-full rounded-lg border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition pl-10"
                        value={formData.hours}
                        onChange={(e) => {
                          // ЛОГІКА ВИПРАВЛЕННЯ:
                          const val = e.target.value;
                          setFormData({ 
                            ...formData, 
                            hours: val === "" ? "" : Number(val) // Якщо пусто -> ставимо пустий рядок, інакше число
                          });
                        }}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400">⏱️</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Textarea */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      className="block w-full rounded-lg border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition"
                      placeholder="What did you work on?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all transform hover:-translate-y-0.5
                      ${loading 
                        ? "bg-indigo-400 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30"}`}
                  >
                    {loading ? "Saving..." : "Save Entry"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* 📋 RIGHT COLUMN: HISTORY LIST */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 h-full flex flex-col min-h-[400px]">
              <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                <h2 className="text-white text-lg font-bold flex items-center gap-2">
                  <span>📅</span> History
                </h2>
                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Total: {totalHours}h
                </span>
              </div>

              <div className="p-6 flex-1 overflow-y-auto max-h-[600px] bg-slate-50">
                {entries.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                    <span className="text-4xl mb-2">📭</span>
                    <p>No entries yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 items-start"
                      >
                        {/* Date Box */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 rounded-lg p-2 w-16 text-center border border-indigo-100">
                          <span className="text-[10px] font-bold uppercase block tracking-tighter">
                            {new Date(entry.date).toLocaleString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-xl font-extrabold block leading-none">
                            {new Date(entry.date).getDate()}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-sm font-bold text-slate-800 truncate pr-2">{entry.project}</h3>
                            <span className="flex-shrink-0 bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded border border-green-200">
                              {entry.hours}h
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed break-words">
                            {entry.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}