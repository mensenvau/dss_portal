"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Assignment = { employee_id: number; full_name: string; client_id: number; client_name: string };

export default function GetAssignmentsPage() {
  const [items, set_items] = useState<Assignment[]>([]);
  const [employee_id, set_employee_id] = useState("");
  const [client_id, set_client_id] = useState("");
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  async function load() {
    try {
      const r = await apiGet("/api/assignments");
      set_items(r?.data || []);
    } catch (err: any) {
      set_error(err?.message || "Failed");
    } finally {
      set_loading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function postAssign(e: React.FormEvent) {
    e.preventDefault();
    set_error(null);
    try {
      await apiPost("/api/assignments", { employee_id: Number(employee_id), client_id: Number(client_id) });
      set_employee_id("");
      set_client_id("");
      load();
    } catch (err: any) {
      set_error(err?.message || "Assign failed");
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4 max-w-5xl mx-auto grid gap-6">
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Assign employee to client</div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={postAssign} className="grid gap-2 sm:grid-cols-3">
          <input value={employee_id} onChange={(e) => set_employee_id(e.target.value)} placeholder="Employee ID" className="border px-3 py-2 rounded" />
          <input value={client_id} onChange={(e) => set_client_id(e.target.value)} placeholder="Client ID" className="border px-3 py-2 rounded" />
          <Button>Assign</Button>
        </form>
      </Card>
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Assignments</div>
        <div className="grid gap-2">
          {items.map((it, idx) => (
            <div key={idx} className="border rounded p-3 text-sm flex justify-between">
              <span>
                Employee {it.employee_id} ({it.full_name}) → Client {it.client_id} ({it.client_name})
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
