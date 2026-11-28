'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ResponseValue } from '@/core/types';

const choices: Array<{ value: ResponseValue; label: string }> = [
  { value: 'C', label: 'Cumple' },
  { value: 'P', label: 'Cumple parcialmente' },
  { value: 'NC', label: 'No cumple' },
  { value: 'NA', label: 'No aplica' },
];

export interface ChecklistItemProps {
  evaluationId: string;
  item: { id: string; code: string; statement: string; targetRole: string; expectedDeliverable: string };
  response?: {
    value: ResponseValue;
    assignedRole: string | null;
    observations: string | null;
    dateLabel: string;
    evidences: Array<{ id: string; title: string; type: 'FILE' | 'LINK' }>;
  };
  canEdit: boolean;
}

export function ChecklistItem({ evaluationId, item, response, canEdit }: ChecklistItemProps) {
  const router = useRouter();
  const [value, setValue] = useState(response?.value);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', error: false });
  const link = useRef<HTMLInputElement>(null);
  const file = useRef<HTMLInputElement>(null);

  async function save(nextValue: ResponseValue, details?: FormData) {
    setSaving(true);
    setFeedback({ text: 'Guardando…', error: false });

    const body = details ?? new FormData();
    body.set('evaluationId', evaluationId);
    body.set('itemId', item.id);
    body.set('value', nextValue);

    try {
      const res = await fetch('/api/evaluaciones', { method: 'POST', body });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      setValue(nextValue);
      if (details) {
        if (link.current) link.current.value = '';
        if (file.current) file.current.value = '';
      }
      setFeedback({ text: 'Guardado.', error: false });
      router.refresh();
    } catch (error) {
      const text = error instanceof Error ? error.message : 'No se guardaron los cambios.';
      setFeedback({ text, error: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="space-y-3 py-4">
      <div>
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <strong className="mr-2 font-mono text-brand-600 dark:text-brand-300">{item.code}</strong>
          {item.statement}
        </p>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          Evidencia esperada: {item.expectedDeliverable} · Rol sugerido: {item.targetRole}
        </p>
      </div>

      {canEdit ? (
        <fieldset className="flex flex-wrap gap-2" disabled={saving}>
          <legend className="sr-only">Calificación de {item.code}</legend>
          {choices.map((choice) => (
            <Button
              key={choice.value}
              type="button"
              variant={value === choice.value ? 'default' : 'outline'}
              aria-pressed={value === choice.value}
              onClick={() => save(choice.value)}
              size="sm"
            >
              {choice.label}
            </Button>
          ))}
        </fieldset>
      ) : (
        <p className="text-sm font-medium">{choices.find((choice) => choice.value === value)?.label ?? 'Sin calificar'}</p>
      )}

      <details>
        <summary className="w-fit cursor-pointer text-sm font-medium text-brand-700 dark:text-brand-300">
          Evidencias y observaciones{response?.evidences.length ? ` (${response.evidences.length})` : ''}
        </summary>
        <div className="mt-3 space-y-3">
          {response && <p className="text-xs text-gray-600 dark:text-gray-400">Último registro: {response.dateLabel}</p>}
          {response?.evidences.map((evidence) => (
            <a
              key={evidence.id}
              href={`/api/evaluaciones/evidencias/${evidence.id}`}
              target={evidence.type === 'LINK' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="block break-all text-sm text-brand-700 underline dark:text-brand-300"
            >
              {evidence.title}
            </a>
          ))}
          {canEdit ? (
            <form
              aria-label={`Detalles de ${item.code}`}
              method="post"
              className="grid gap-3 text-sm sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (value) void save(value, new FormData(event.currentTarget));
              }}
            >
              <label className="space-y-1">
                <span>Responsable</span>
                <input name="assignedRole" maxLength={120} defaultValue={response?.assignedRole ?? ''} className="block w-full rounded border bg-background p-2" />
              </label>
              <label className="space-y-1">
                <span>Observaciones</span>
                <textarea name="observations" maxLength={2000} defaultValue={response?.observations ?? ''} className="block w-full rounded border bg-background p-2" />
              </label>
              <label className="space-y-1">
                <span>Enlace externo</span>
                <input ref={link} name="evidenceUrl" type="url" maxLength={2048} placeholder="https://" className="block w-full rounded border bg-background p-2" />
              </label>
              <label className="space-y-1">
                <span>Archivo (máximo 1 MB)</span>
                <input ref={file} name="evidenceFile" type="file" className="block w-full rounded border bg-background p-2" />
              </label>
              <div>
                <Button size="sm" type="submit" disabled={!value || saving}>Guardar detalles</Button>
                {!value && <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Marca primero el estado del ítem.</p>}
              </div>
            </form>
          ) : response && (
            <div className="space-y-1 text-sm">
              {response.assignedRole && <p>Responsable: {response.assignedRole}</p>}
              {response.observations && <p>Observaciones: {response.observations}</p>}
            </div>
          )}
        </div>
      </details>
      <p role="status" className={feedback.error ? 'text-xs text-red-700 dark:text-red-300' : 'text-xs text-gray-600 dark:text-gray-400'}>
        {feedback.text}
      </p>
    </li>
  );
}
