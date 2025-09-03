"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Survey = { id: number; title: string; created_at: string };

export default function GetSurveysPage() {
  const [items, set_items] = useState<Survey[]>([]);
  const [title, set_title] = useState('');
  const [schema_json, set_schema_json] = useState('{}');
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  async function load() { try { const r = await apiGet('/api/surveys'); set_items(r?.data || []); } catch (e: any) { set_error(e?.message || 'Failed'); } finally { set_loading(false); } }
  useEffect(() => { load(); }, []);

  async function postSurvey(e: React.FormEvent) {
    e.preventDefault(); set_error(null);
    try { await apiPost('/api/surveys', { title, schema_json: JSON.parse(schema_json || '{}') }); set_title(''); set_schema_json('{}'); load(); }
    catch (err: any) { set_error(err?.message || 'Create failed'); }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4 max-w-6xl mx-auto grid gap-6">
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Create survey</div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={postSurvey} className="grid gap-2">
          <input value={title} onChange={(e) => set_title(e.target.value)} placeholder="Title" className="border px-3 py-2 rounded" />
          <textarea value={schema_json} onChange={(e) => set_schema_json(e.target.value)} placeholder="Schema JSON" rows={5} className="border px-3 py-2 rounded" />
          <Button>Create</Button>
        </form>
      </Card>
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">Surveys</div>
        <div className="grid gap-2">
          {items.map((it) => (
            <div key={it.id} className="border rounded p-3 text-sm flex justify-between">
              <span>{it.title}</span>
              <Link href={`/surveys/${it.id}`} className="text-blue-600">Open</Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

