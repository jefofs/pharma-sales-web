'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useVisits } from '@/context/VisitContext';

export default function VisitsListPage() {
  const { visits, loading, deleteVisit } = useVisits();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Filtro inteligente por médico/observação e por status
  const filteredVisits = visits.filter((v) => {
    const matchSearch =
      (v.doctorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      String(v.doctorId).includes(searchTerm) ||
      (v.observations?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'TODOS' || v.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: number | string) => {
    if (confirm('Tem certeza de que deseja excluir esta visita?')) {
      await deleteVisit(id);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visitas Registradas</h1>
          <p className="text-slate-500 text-sm">
            Gerencie o histórico e status de visitas médicas.
          </p>
        </div>
        <Link
          href="/visitas/nova"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          + Agendar Visita
        </Link>
      </div>

      {/* Busca e Filtros (RF03) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por médico, ID ou observação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:col-span-2 px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
        >
          <option value="TODOS">Todos os Status</option>
          <option value="AGENDADA">AGENDADA</option>
          <option value="CONCLUIDA">CONCLUIDA</option>
          <option value="CANCELADA">CANCELADA</option>
          <option value="REAGENDADA">REAGENDADA</option>
        </select>
      </div>

      {/* Lista de Cards */}
      {loading && visits.length === 0 ? (
        <p className="text-slate-500 text-center py-12">Carregando visitas...</p>
      ) : filteredVisits.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-600 font-medium">Nenhuma visita encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVisits.map((visit) => (
            <div
              key={visit.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-bold text-slate-900 text-lg">
                    {visit.doctorName || `Médico ID: ${visit.doctorId}`}
                  </h2>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      visit.status === 'CONCLUIDA'
                        ? 'bg-emerald-100 text-emerald-800'
                        : visit.status === 'CANCELADA'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {visit.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-2">
                  📅 {visit.date} às {visit.time}
                  {!visit.sincronizado && (
                    <span className="ml-2 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      Offline
                    </span>
                  )}
                </p>

                {visit.observations && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {visit.observations}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Link
                  href={`/visitas/${visit.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver / Editar
                </Link>
                <button
                  onClick={() => handleDelete(visit.id)}
                  className="text-sm font-medium text-rose-600 hover:text-rose-800"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}