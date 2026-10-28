'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useVisits } from '@/context/VisitContext';

export default function EditVisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { visits, updateVisit, deleteVisit } = useVisits();

  const visitId: number | string = /^\d+$/.test(id) ? Number(id) : id;

  const [loadedId, setLoadedId] = useState<string | null>(null);

  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [observations, setObservations] = useState('');
  const [presentedMaterial, setPresentedMaterial] = useState('');

  const [status, setStatus] = useState<
    'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA'
  >('AGENDADA');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const current = visits.find((v) => String(v.id) === id);

  if (current && loadedId !== String(current.id)) {
    setLoadedId(String(current.id));
    setDoctorId(String(current.doctorId));
    setDate(current.date);
    setTime(current.time);
    setObservations(current.observations || '');
    setPresentedMaterial(
      current.presentedMaterial || ''
    );
    setStatus(current.status);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setError('');

    try {
      await updateVisit(visitId, {
        doctorId: Number(doctorId),
        userId: 1,
        date,
        time,
        observation: observations,
        presentedMaterial,
        status,
      });

      router.push('/');
    } catch (err) {
      console.error('Erro ao atualizar visita:', err);
      setError('Não foi possível atualizar a visita.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Deseja realmente remover esta visita?')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await deleteVisit(visitId);
      router.push('/');
    } catch (err) {
      console.error('Erro ao excluir visita:', err);
      setError('Não foi possível excluir a visita.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900">
            Detalhes & Edição
          </h1>

          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="text-sm text-rose-600 hover:text-rose-800 font-medium disabled:opacity-50"
          >
            {deleting ? 'Excluindo...' : 'Excluir Visita'}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Status da Visita
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | 'AGENDADA'
                    | 'CONCLUIDA'
                    | 'CANCELADA'
                    | 'REAGENDADA'
                )
              }
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="AGENDADA">AGENDADA</option>
              <option value="CONCLUIDA">CONCLUIDA</option>
              <option value="CANCELADA">CANCELADA</option>
              <option value="REAGENDADA">REAGENDADA</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="doctorId"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              ID do Médico
            </label>

            <input
              id="doctorId"
              type="number"
              min="1"
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Data
              </label>

              <input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Horário
              </label>

              <input
                id="time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="presentedMaterial"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Material Apresentado
            </label>

            <input
              id="presentedMaterial"
              type="text"
              value={presentedMaterial}
              onChange={(e) => setPresentedMaterial(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="observations"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Observações
            </label>

            <textarea
              id="observations"
              rows={3}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              disabled={saving || deleting}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Voltar
            </button>

            <button
              type="submit"
              disabled={saving || deleting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Atualizar Visita'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}