"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card } from "@/components/ui/card";

type Course = { id: number; title: string; summary?: string };

export default function GetLmsPage() {
  const [courses, set_courses] = useState<Course[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/api/lms/courses");
        set_courses(data?.data || []);
      } catch (err: any) {
        set_error(err?.message || "Failed to load");
      } finally {
        set_loading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 grid gap-4 sm:grid-cols-2">
      {courses.map((c) => (
        <Card key={c.id} className="p-4">
          <div className="text-lg font-semibold">{c.title}</div>
          <div className="text-sm text-gray-600">{c.summary}</div>
        </Card>
      ))}
    </div>
  );
}
