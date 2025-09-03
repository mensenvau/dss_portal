"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function GetLmsCoursePage() {
  const params = useParams<{ id: string }>();
  const [course, set_course] = useState<any>(null);
  const [title, set_title] = useState('');
  const [content, set_content] = useState('');
  const [error, set_error] = useState<string | null>(null);

  async function load() { try { const r = await apiGet(`/api/lms/courses/${params.id}`); set_course(r?.data || null); } catch (e: any) { set_error(e?.message || 'Failed'); } }
  useEffect(() => { load(); }, [params?.id]);

  async function postLesson(e: React.FormEvent) {
    e.preventDefault(); set_error(null);
    try { await apiPost(`/api/lms/courses/${params.id}/lessons`, { title, content }); set_title(''); set_content(''); load(); }
    catch (err: any) { set_error(err?.message || 'Create failed'); }
  }

  if (!course) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4 max-w-4xl mx-auto grid gap-6">
      <Card className="p-4">
        <div className="text-lg font-semibold">{course?.course?.title}</div>
        <div className="text-sm text-gray-600">{course?.course?.summary}</div>
      </Card>
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Lessons</div>
        <div className="grid gap-2">
          {(course?.lessons || []).map((l: any) => (
            <div key={l.id} className="border rounded p-3 text-sm">{l.title}</div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Add lesson</div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={postLesson} className="grid gap-2">
          <input value={title} onChange={(e) => set_title(e.target.value)} placeholder="Title" className="border px-3 py-2 rounded" />
          <textarea value={content} onChange={(e) => set_content(e.target.value)} placeholder="Content" className="border px-3 py-2 rounded" rows={5} />
          <Button>Add</Button>
        </form>
      </Card>
    </div>
  );
}

