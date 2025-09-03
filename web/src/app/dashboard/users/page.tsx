"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type User = { id: number; full_name: string; email: string; role: string; roles: string[] };

export default function GetUsersPage() {
  const [items, set_items] = useState<User[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const [user_id, set_user_id] = useState("");
  const [role, set_role] = useState("employee");

  async function load() {
    try {
      const r = await apiGet("/api/auth/users");
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

  async function postAssignRole(e: React.FormEvent) {
    e.preventDefault();
    set_error(null);
    try {
      await apiPost(`/api/auth/users/${user_id}/roles/${role}`, {});
      set_user_id("");
      set_role("employee");
      load();
    } catch (err: any) {
      set_error(err?.message || "Assign failed");
    }
  }

  async function deleteRole(id: number, role_name: string) {
    try {
      await apiDelete(`/api/auth/users/${id}/roles/${role_name}`);
      load();
    } catch (err: any) {
      set_error(err?.message || "Remove failed");
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4 max-w-6xl mx-auto grid gap-6">
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Assign role</div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={postAssignRole} className="grid gap-2 sm:grid-cols-3">
          <input value={user_id} onChange={(e) => set_user_id(e.target.value)} placeholder="User ID" className="border px-3 py-2 rounded" />
          <input value={role} onChange={(e) => set_role(e.target.value)} placeholder="Role (e.g., employee, manager)" className="border px-3 py-2 rounded" />
          <Button>Assign</Button>
        </form>
      </Card>
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Users</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Roles</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.full_name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set([u.role, ...(u.roles || [])])).map((r) => (
                        <span key={r} className="border rounded px-2 py-1 flex items-center gap-2">
                          {r}
                          {r !== "admin" && (
                            <button onClick={() => deleteRole(u.id, r)} className="text-red-600">
                              x
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2 text-right"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
