"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function RegisterPage() {
  const [full_name, set_full_name] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const data = await apiPost("/api/auth/register", { full_name, email, password });
      setAuthToken(data?.token || "");
      toast({ title: "Registered", description: "Account created successfully" });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Register failed");
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="text-xl font-semibold">Register</div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input value={full_name} onChange={(e) => set_full_name(e.target.value)} placeholder="Full name" className="w-full border px-3 py-2 rounded" />
        <input value={email} onChange={(e) => set_email(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
        <input type="password" value={password} onChange={(e) => set_password(e.target.value)} placeholder="Password" className="w-full border px-3 py-2 rounded" />
        <Button className="w-full">Register</Button>
      </form>
    </div>
  );
}
