"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/own/navbar";

export default function LoginPage() {
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error, set_error] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    set_error(null);
    try {
      const data = await apiPost("/api/auth/login", { email, password });
      setAuthToken(data?.token || "");
      toast({ title: "Welcome back", description: "Logged in successfully" });
      router.replace("/register");
    } catch (err: any) {
      set_error(err?.message || "Login failed");
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-sm mx-auto p-8">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="text-xl font-semibold">Sign In</div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <input value={email} onChange={(e) => set_email(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
          <input type="password" value={password} onChange={(e) => set_password(e.target.value)} placeholder="Password" className="w-full border px-3 py-2 rounded" />
          <Button className="w-full">Login</Button>
        </form>
      </div>
    </>
  );
}
