"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TimeEntry = { id: number; employee_id: number; role: string; hours: number; points: number; work_date: string; comment?: string };

export default function GetTimePage() {
  const [items, set_items] = useState<TimeEntry[]>([]);
  const [from, set_from] = useState<string>("");
  const [to, set_to] = useState<string>("");
  const [scoreboard, set_scoreboard] = useState<any[]>([]);

  const [employee_id, set_employee_id] = useState("");
  const [role, set_role] = useState("employee");
  const [hours, set_hours] = useState("");
  const [points, set_points] = useState("");
  const [work_date, set_work_date] = useState("");
  const [comment, set_comment] = useState("");
  const [error, set_error] = useState<string | null>(null);

  async function loadList() {
    try {
      const r = await apiGet("/api/time");
      set_items(r?.data || []);
    } catch {}
  }
  async function loadScoreboard() {
    if (!from || !to) return;
    try {
      const r = await apiGet(`/api/time/scoreboard?from=${from}&to=${to}`);
      set_scoreboard(r?.data || []);
    } catch {}
  }
  useEffect(() => {
    loadList();
  }, []);
  useEffect(() => {
    loadScoreboard();
  }, [from, to]);

  async function postTime(e: React.FormEvent) {
    e.preventDefault();
    set_error(null);
    try {
      await apiPost("/api/time", { employee_id: Number(employee_id), role, hours: Number(hours), points: Number(points), work_date, comment });
      set_employee_id("");
      set_role("employee");
      set_hours("");
      set_points("");
      set_work_date("");
      set_comment("");
      loadList();
    } catch (err: any) {
      set_error(err?.message || "Log failed");
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto grid gap-6">
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Log time</div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={postTime} className="grid gap-2 sm:grid-cols-6">
          <input value={employee_id} onChange={(e) => set_employee_id(e.target.value)} placeholder="Employee ID" className="border px-3 py-2 rounded" />
          <input value={role} onChange={(e) => set_role(e.target.value)} placeholder="Role" className="border px-3 py-2 rounded" />
          <input value={hours} onChange={(e) => set_hours(e.target.value)} placeholder="Hours" className="border px-3 py-2 rounded" />
          <input value={points} onChange={(e) => set_points(e.target.value)} placeholder="Points" className="border px-3 py-2 rounded" />
          <input value={work_date} onChange={(e) => set_work_date(e.target.value)} placeholder="YYYY-MM-DD" className="border px-3 py-2 rounded" />
          <input value={comment} onChange={(e) => set_comment(e.target.value)} placeholder="Comment" className="border px-3 py-2 rounded" />
          <div className="sm:col-span-6">
            <Button>Save</Button>
          </div>
        </form>
      </Card>

      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Time entries</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Emp</th>
                <th className="p-2">Role</th>
                <th className="p-2">Hours</th>
                <th className="p-2">Points</th>
                <th className="p-2">Date</th>
                <th className="p-2">Comment</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="p-2">{it.id}</td>
                  <td className="p-2">{it.employee_id}</td>
                  <td className="p-2">{it.role}</td>
                  <td className="p-2">{it.hours}</td>
                  <td className="p-2">{it.points}</td>
                  <td className="p-2">{it.work_date}</td>
                  <td className="p-2">{it.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Scoreboard</div>
        <div className="flex gap-2 mb-2">
          <input value={from} onChange={(e) => set_from(e.target.value)} placeholder="From YYYY-MM-DD" className="border px-3 py-2 rounded" />
          <input value={to} onChange={(e) => set_to(e.target.value)} placeholder="To YYYY-MM-DD" className="border px-3 py-2 rounded" />
        </div>
        <div className="grid gap-2">
          {scoreboard.map((r: any, idx) => (
            <div key={idx} className="border rounded p-3 text-sm flex justify-between">
              <span>Emp {r.employee_id}</span>
              <span>
                {r.points} pts / {r.hours} h
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
