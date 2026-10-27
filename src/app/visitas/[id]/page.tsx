'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useVisits } from '@/context/VisitContext';

export default function EditVisitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { visits, updateVisit, deleteVisit } = useVisits();

  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [observations, setObservations] = useState('');
  const [presentedMaterial, setPresentedMaterial] = useState('');
  const [status, setStatus] = useState<'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA'>('AGENDADA');
  const [saving, setSaving] = useState(false);

  // Busca a visita atual para preencher os campos do formulário
  useEffect(() => {
    const current = visits.find((v) => String(v.id) === id);
    if (current) {
      setDoctorId(String(current.doctorId));
      setDate(current.date);
      setTime(current.time);
      setObservations(current.observations || '');
      setPresentedMaterial(current.presentedMaterial || '');
      setStatus(current.status);
    }
  }, [id, visits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateVisit(id, {
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
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Deseja realmente remover esta visita?')) {
      await deleteVisit(id);
      router.push('/');
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900">Detalhes & Edição</h1>
          <button
            onClick={handleDelete}
            className="text-sm text-rose-600 hover:text-rose-800 font-medium"
          >
            Excluir Visita
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status da Visita
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="AGENDADA">AGENDADA</option>
              <option value="CONCLUIDA">CONCLUIDA</option>
              <option value="CANCELADA">CANCELADA</option>
              <option value="REAGENDADA">REAGENDADA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ID do Médico
            </label>
            <input
              type="number"
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Horário
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Material Apresentado
            </label>
            <input
              type="text"
              value={presentedMaterial}
              onChange={(e) => setPresentedMaterial(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Observações
            </label>
            <textarea
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
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={saving}
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