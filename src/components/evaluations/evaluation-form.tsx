'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EvaluationFormProps {
  standards: Array<{ code: string; shortTitle: string }>;
  organizations: Array<{ id: string; name: string }>;
  standardCode?: string;
}

const inputClass = 'block w-full rounded border bg-background p-2';

export function EvaluationForm({ standards, organizations, standardCode }: EvaluationFormProps) {
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  return (
    <form
      aria-label="Nueva evaluación"
      method="post"
      className="grid gap-3 text-sm sm:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        const fields = new FormData(event.currentTarget);
        const norm = String(fields.get('standardCode'));
        const organization = organizationId || {
          name: fields.get('name'),
          teamSize: Number(fields.get('teamSize')),
          targetProfile: fields.get('targetProfile'),
        };

        try {
          const res = await fetch('/api/evaluaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ standardCode: norm, organization }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          router.push(`/evaluaciones?norma=${encodeURIComponent(norm)}&evaluacion=${encodeURIComponent(data.id)}#checklist`);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'No se pudo crear la evaluación.');
        } finally {
          setSaving(false);
        }
      }}
    >
      <label className="space-y-1">
        <span>Norma</span>
        <select name="standardCode" className={inputClass} defaultValue={standardCode} required>
          {standards.map((standard) => <option key={standard.code} value={standard.code}>{standard.shortTitle}</option>)}
        </select>
      </label>
      <label className="space-y-1">
        <span>Organización</span>
        <select name="organizationId" value={organizationId} onChange={(event) => setOrganizationId(event.target.value)} className={inputClass}>
          {organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
          <option value="">Registrar una organización</option>
        </select>
      </label>
      {!organizationId && (
        <>
          <label className="space-y-1">
            <span>Nombre</span>
            <input name="name" required maxLength={160} className={inputClass} />
          </label>
          <label className="space-y-1">
            <span>Personas en el equipo</span>
            <input name="teamSize" required type="number" min={1} max={25} className={inputClass} />
          </label>
          <label className="space-y-1">
            <span>Perfil objetivo</span>
            <input name="targetProfile" required maxLength={80} className={inputClass} />
          </label>
        </>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={saving || !standards.length}>{saving ? 'Creando…' : 'Crear evaluación'}</Button>
        <p role="status" className="mt-2 text-red-700 dark:text-red-300">{error}</p>
      </div>
    </form>
  );
}
