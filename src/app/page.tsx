'use client';

import { useState } from 'react';
import { useVisits } from '@/context/VisitContext';
import { useNotifications } from '@/context/NotificationContext';
import { useOfflineSync } from '@/context/NetworkContext';

export default function Home() {
  const { isConnected, isSyncing } = useOfflineSync();
  const { unreadCount, markAllAsRead } = useNotifications();
  const { visits, loading, pendingCount, addVisit, deleteVisit } = useVisits();

  // Estados para o formulário de cadastro
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [observations, setObservations] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !date || !time) return;

    await addVisit({
      doctorId: Number(doctorId),
      userId: 1,
      date,
      time,
      observation: observations,
      presentedMaterial: 'Amostras Grátis',
      status: 'AGENDADA',
    });

    setDoctorId('');
    setDate('');
    setTime('');
    setObservations('');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabeçalho do Dashboard */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Pharma Sales Manager</h1>
            <p className="text-sm text-slate-500">Gestão de Visitas Médicas & Representantes</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Online/Offline */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ${
                isConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isConnected ? 'Online' : 'Modo Offline'}
            </span>

            {isSyncing && (
              <span className="text-xs text-blue-600 font-medium animate-pulse">
                Sincronizando...
              </span>
            )}

            {/* Pendências de Sync */}
            {pendingCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {pendingCount} pendente(s)
              </span>
            )}

            {/* Notificações */}
            <button
              onClick={markAllAsRead}
              className="relative bg-slate-100 hover:bg-slate-200 transition-colors p-2 rounded-full text-sm"
              title="Marcar notificações como lidas"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formulário de Agendamento */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Nova Visita</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ID do Médico
                </label>
                <input
                  type="number"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="Ex: 1"
                  required
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Horário
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Observações
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Detalhes sobre a visita..."
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
              >
                Agendar Visita
              </button>
            </form>
          </section>

          {/* Listagem de Visitas */}
          <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Visitas Registradas</h2>

            {loading ? (
              <div className="py-8 text-center text-slate-500 text-sm">Carregando visitas...</div>
            ) : visits.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                Nenhuma visita cadastrada.
              </div>
            ) : (
              <div className="space-y-3">
                {visits.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50 hover:bg-white transition-all shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">
                          {item.doctorName || `Médico ID: ${item.doctorId}`}
                        </span>
                        {!item.sincronizado && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                            Offline
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        📅 {item.date} às {item.time} | Status: <span className="font-medium text-slate-700">{item.status}</span>
                      </p>
                      {item.observations && (
                        <p className="text-xs text-slate-600 italic">{item.observations}</p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteVisit(item.id)}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}