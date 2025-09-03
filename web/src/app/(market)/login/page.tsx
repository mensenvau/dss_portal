"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

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
      router.replace("/dashboard");
    } catch (err: any) {
      set_error(err?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-sm mx-auto p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email" value={email} onChange={(e) => set_email(e.target.value)} />
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" placeholder="Password" value={password} onChange={(e) => set_password(e.target.value)} />
        </div>

        <Button className="w-full">Login</Button>
      </form>
    </div>
  );
}
