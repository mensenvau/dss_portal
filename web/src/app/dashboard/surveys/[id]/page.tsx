"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function GetSurveyPage() {
  const params = useParams<{ id: string }>();
  const [survey, set_survey] = useState<any>(null);
  const [answers, set_answers] = useState<any>({});
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  async function load() {
    try { const r = await apiGet(`/api/surveys/${params.id}`); set_survey(r?.data || null); }
    catch (err: any) { set_error(err?.message || 'Failed'); }
    finally { set_loading(false); }
  }
  useEffect(() => { load(); }, [params?.id]);

  function updateAnswer(key: string, value: string) { set_answers((prev: any) => ({ ...prev, [key]: value })); }

  async function postSubmit(e: React.FormEvent) {
    e.preventDefault(); set_error(null);
    try { await apiPost(`/api/surveys/${params.id}/submit`, { answers }); alert('Submitted'); }
    catch (err: any) { set_error(err?.message || 'Submit failed'); }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (!survey) return <div className="p-4">Not found</div>;

  const schema = (() => { try { return JSON.parse(survey.schema_json || '{}'); } catch { return {}; } })();
  const fields: string[] = Array.isArray(schema?.fields) ? schema.fields : Object.keys(schema || {});

  return (
    <div className="p-4 max-w-3xl mx-auto grid gap-4">
      <Card className="p-4">
        <div className="text-lg font-semibold mb-2">{survey.title}</div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={postSubmit} className="grid gap-3">
          {fields.map((f) => (
            <div key={f} className="grid gap-1">
              <label className="text-sm">{f}</label>
              <input value={answers[f] || ''} onChange={(e) => updateAnswer(f, e.target.value)} className="border px-3 py-2 rounded" />
            </div>
          ))}
          <Button>Submit</Button>
        </form>
      </Card>
    </div>
  );
}

