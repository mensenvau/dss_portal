"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-provider";

export default function GetPayrollPage() {
  const { user } = useAuth();
  const [from, set_from] = useState("");
  const [to, set_to] = useState("");
  const [data, set_data] = useState<{ hours: number; amount: number } | null>(null);
  const [error, set_error] = useState<string | null>(null);

  async function load() {
    if (!user?.id || !from || !to) return;
    try {
      const r = await apiGet(`/api/payroll/${user.id}?from=${from}&to=${to}`);
      set_data(r?.data || null);
    } catch (err: any) {
      set_error(err?.message || "Failed");
    }
  }

  useEffect(() => {
    /* wait for user */
  }, [user]);

  return (
    <div className="p-4  mx-auto grid gap-4">
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">My payroll</div>
        <div className="grid gap-2">
          <input value={from} onChange={(e) => set_from(e.target.value)} placeholder="From YYYY-MM-DD" className="border px-3 py-2 rounded" />
          <input value={to} onChange={(e) => set_to(e.target.value)} placeholder="To YYYY-MM-DD" className="border px-3 py-2 rounded" />
          <button onClick={load} className="bg-black text-white px-3 py-2 rounded">
            Load
          </button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {data && (
            <div className="text-sm">
              Hours: <b>{data.hours}</b> | Amount: <b>{data.amount}</b>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
