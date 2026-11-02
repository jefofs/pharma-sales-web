'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVisits } from '@/context/VisitContext';

export default function NewVisitPage() {
  const router = useRouter();
  const { addVisit } = useVisits();

  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [observations, setObservations] = useState('');
  const [presentedMaterial, setPresentedMaterial] = useState('');

  const [status, setStatus] = useState<
    'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA'
  >('AGENDADA');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!doctorId || !date || !time) {
      setError('Preencha os campos obrigatórios (Médico, Data e Horário).');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await addVisit({
        doctorId: Number(doctorId),
        userId: 1,
        date,
        time,
        observation: observations,
        observations: observations,
        presentedMaterial,
        status,
      });

      router.push('/');
    } catch (err) {
      console.error('Erro ao agendar visita:', err);
      setError('Não foi possível agendar a visita.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-4">
          Agendar Nova Visita
        </h1>

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
              disabled={saving}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Agendando...' : 'Agendar Visita'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}