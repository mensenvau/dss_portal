"use client";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Appointment = {
  id: number;
  client_id: number;
  current_day: string;
  slot_time: string;
  recruiter_name?: string;
  role?: string;
  client?: string;
  round?: number;
  confirmed?: boolean;
  short_code?: string;
  type?: string;
  notes?: string;
};

const DIM_SHORT_CODES = ["FTE (W2)", "W2-C", "CTH", "1099", "C2C"];
const DIM_TYPES = ["Hybrid", "Remote", "Full OnSite"];
const DIM_ROUNDS = [1, 2, 3, 4, 5, 6, 7];

export default function appointmentsPage() {
  const [items, set_items] = useState<Appointment[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const [edit_id, set_edit_id] = useState<number | null>(null);
  const [week_offset, set_week_offset] = useState<number>(0);

  const [current_day, set_current_day] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [slot_time, set_slot_time] = useState<string>("");
  const [recruiter_name, set_recruiter_name] = useState<string>("");
  const [role, set_role] = useState<string>("");
  const [client, set_client] = useState<string>("");
  const [round, set_round] = useState<number>(1);
  const [confirmed, set_confirmed] = useState<boolean>(false);
  const [short_code, set_short_code] = useState<string>("");
  const [type, set_type] = useState<string>("");
  const [notes, set_notes] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet(`/api/appointments?week=${week_offset}`);
        set_items(data?.data || []);
      } catch (err: any) {
        const msg = err?.message || "Failed to load";
        set_error(msg);
        if (typeof window !== "undefined") alert(msg);
      } finally {
        set_loading(false);
      }
    }
    load();
  }, [week_offset]);

  const slot_options = useMemo(() => buildSlots(), []);

  function resetForm() {
    set_edit_id(null);
    set_current_day(new Date().toISOString().slice(0, 10));
    set_slot_time("");
    set_recruiter_name("");
    set_role("");
    set_client("");
    set_round(1);
    set_confirmed(false);
    set_short_code("");
    set_type("");
    set_notes("");
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    set_error(null);
    try {
      if (!current_day || !slot_time) throw new Error("Date and slot required");
      const payload = { current_day, slot_time, recruiter_name, role, client, round, confirmed, short_code, type, notes };
      if (edit_id) {
        await apiPatch(`/api/appointments/${edit_id}`, payload);
      } else {
        await apiPost("/api/appointments", payload);
      }
      const r = await apiGet(`/api/appointments?week=${week_offset}`);
      set_items(r?.data || []);
      resetForm();
    } catch (err: any) {
      set_error(err?.message || "Save failed");
    }
  }

  async function deleteAppointment(id: number) {
    try {
      await apiDelete(`/api/appointments/${id}`);
      const r = await apiGet(`/api/appointments?week=${week_offset}`);
      set_items(r?.data || []);
    } catch (err: any) {
      set_error(err?.message || "Delete failed");
    }
  }

  function loadForEdit(a: Appointment) {
    set_edit_id(a.id);
    set_current_day(a.current_day || new Date().toISOString().slice(0, 10));
    set_slot_time(a.slot_time || "");
    set_recruiter_name(a.recruiter_name || "");
    set_role(a.role || "");
    set_client(a.client || "");
    set_round(a.round || 1);
    set_confirmed(!!a.confirmed);
    set_short_code(a.short_code || "");
    set_type(a.type || "");
    set_notes(a.notes || "");
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="mx-auto p-4 grid gap-2 lg:grid-cols-4">
      <div className="lg:col-span-4 flex items-center justify-between">
        <div className="text-base font-medium">Week view</div>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={() => set_week_offset(week_offset - 1)}>
            Prev week
          </Button>
          <Button variant="outline" type="button" onClick={() => set_week_offset(0)}>
            This week
          </Button>
          <Button variant="outline" type="button" onClick={() => set_week_offset(week_offset + 1)}>
            Next week
          </Button>
        </div>
      </div>
      <Card className="p-4 lg:col-span-1 shadow-none border">
        <div className="text-lg font-semibold">{edit_id ? "Edit appointment" : "Create appointment"}</div>
        <form onSubmit={submitForm} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" value={current_day} onChange={(e) => set_current_day(e.target.value)} />
            <select className="border rounded px-2 py-2" value={slot_time} onChange={(e) => set_slot_time(e.target.value)}>
              <option value="">Select slot</option>
              {slot_options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <Input placeholder="Recruiter's name" value={recruiter_name} onChange={(e) => set_recruiter_name(e.target.value)} />
          <Input placeholder="Role" value={role} onChange={(e) => set_role(e.target.value)} />
          <Input placeholder="Client" value={client} onChange={(e) => set_client(e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <select className="border rounded px-2 py-2" value={round} onChange={(e) => set_round(Number(e.target.value) as any)}>
              {DIM_ROUNDS.map((n) => (
                <option key={n} value={n}>{`Round ${n}`}</option>
              ))}
            </select>
            <select className="border rounded px-2 py-2" value={String(confirmed)} onChange={(e) => set_confirmed(e.target.value === "true")}>
              <option value="false">Not confirmed</option>
              <option value="true">Confirmed</option>
            </select>
            <select className="border rounded px-2 py-2" value={short_code} onChange={(e) => set_short_code(e.target.value)}>
              <option value="">Short Code</option>
              {DIM_SHORT_CODES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <select className="border rounded px-2 py-2" value={type} onChange={(e) => set_type(e.target.value)}>
            <option value="">Type</option>
            {DIM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Textarea value={notes} onChange={(e) => set_notes(e.target.value)} placeholder="Notes" rows={5} />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {edit_id ? "Save" : "Create"}
            </Button>
            {edit_id && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
      <Card className="p-4 lg:col-span-3 shadow-none border">
        <div className="text-lg font-semibold">Appointments</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Slot</th>
                <th className="p-2">Recruiter</th>
                <th className="p-2">Role</th>
                <th className="p-2">Client</th>
                <th className="p-2">Round</th>
                <th className="p-2">Confirmed</th>
                <th className="p-2">Short Code</th>
                <th className="p-2">Type</th>
                <th className="p-2">Notes</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items
                .slice()
                .sort((a, b) => toMillis(a) - toMillis(b))
                .map((a) => (
                  <tr key={a.id} className={`border-t ${isSoon(a) ? "bg-red-50" : ""}`}>
                    <td className="p-2 whitespace-nowrap">{a.current_day}</td>
                    <td className={`p-2 whitespace-nowrap ${isSoon(a) ? "text-red-600 font-medium" : ""}`}>{a.slot_time}</td>
                    <td className="p-2">{a.recruiter_name || ""}</td>
                    <td className="p-2">{a.role || ""}</td>
                    <td className="p-2">{a.client || ""}</td>
                    <td className="p-2">{a.round || ""}</td>
                    <td className="p-2">{a.confirmed ? "Yes" : "No"}</td>
                    <td className="p-2">{a.short_code || ""}</td>
                    <td className="p-2">{a.type || ""}</td>
                    <td className="p-2 max-w-[260px] truncate" title={a.notes}>
                      {a.notes}
                    </td>
                    <td className="p-2 whitespace-nowrap flex gap-2">
                      <Button variant="outline" type="button" onClick={() => loadForEdit(a)}>
                        Edit
                      </Button>
                      <Button variant="destructive" type="button" onClick={() => deleteAppointment(a.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function buildSlots() {
  const out: string[] = [];
  for (let h = 6; h < 20; h++) {
    for (let m of [0, 30]) {
      const start_min = h * 60 + m;
      const end_min = start_min + 30;
      const eh = Math.floor(end_min / 60);
      const em = end_min % 60;
      if (eh > 20 || (eh === 20 && em > 0)) continue;
      out.push(`${pad(h)}:${pad(m)}-${pad(eh)}:${pad(em)}`);
    }
  }
  return out;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toMillis(a: { current_day: string; slot_time: string }) {
  const [sh, sm] = (a.slot_time?.split("-")[0] || "00:00").split(":").map((v) => parseInt(v, 10));
  const d = new Date(`${a.current_day}T${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}:00`);
  return d.getTime();
}
function isSoon(a: { current_day: string; slot_time: string }) {
  const now = Date.now();
  const t = toMillis(a);
  const diff = t - now;
  return diff >= 0 && diff <= 24 * 60 * 60 * 1000; // within next 24h
}
