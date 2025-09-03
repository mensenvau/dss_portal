"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete, apiPatch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Employee = { id: number; full_name: string; email: string; role: string };

export default function GetEmployeesPage() {
  const [items, set_items] = useState<Employee[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  const [full_name, set_full_name] = useState("");
  const [email, set_email] = useState("");
  const [role, set_role] = useState("employee");

  async function loadEmployees() {
    try {
      const r = await apiGet("/api/employees");
      set_items(r?.data || []);
    } catch (err: any) {
      set_error(err?.message || "Failed");
    } finally {
      set_loading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function postEmployee(e: React.FormEvent) {
    e.preventDefault();
    set_error(null);
    try {
      await apiPost("/api/employees", { full_name, email, role });
      set_full_name("");
      set_email("");
      set_role("employee");
      loadEmployees();
    } catch (err: any) {
      set_error(err?.message || "Create failed");
    }
  }

  async function deleteEmployee(id: number) {
    try {
      await apiDelete(`/api/employees/${id}`);
      loadEmployees();
    } catch (err: any) {
      set_error(err?.message || "Delete failed");
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4 max-w-6xl mx-auto grid gap-6">
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Create employee</div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={postEmployee} className="grid gap-2 sm:grid-cols-4">
          <input value={full_name} onChange={(e) => set_full_name(e.target.value)} placeholder="Full name" className="border px-3 py-2 rounded" />
          <input value={email} onChange={(e) => set_email(e.target.value)} placeholder="Email" className="border px-3 py-2 rounded" />
          <input value={role} onChange={(e) => set_role(e.target.value)} placeholder="Role" className="border px-3 py-2 rounded" />
          <Button>Create</Button>
        </form>
      </Card>

      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Employees</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Full name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="p-2">{it.id}</td>
                  <td className="p-2">{it.full_name}</td>
                  <td className="p-2">{it.email}</td>
                  <td className="p-2">{it.role}</td>
                  <td className="p-2 text-right">
                    <Button variant="outline" onClick={() => deleteEmployee(it.id)}>
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
