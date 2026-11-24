'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NetworkProvider, useOfflineSync } from '@/context/NetworkContext';
import { VisitProvider, useVisits } from '@/context/VisitContext';
import { NotificationProvider } from '@/context/NotificationContext';

function NavigationHeader() {
  const { isConnected, isSyncing, triggerSync } = useOfflineSync();
  const { pendingCount } = useVisits();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-slate-800">
          Pharma Sales <span className="text-blue-600 text-sm font-normal">Web</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={`px-2.5 py-1 rounded-full ${
                isConnected
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {isConnected ? '● Online' : '○ Offline'}
            </span>

            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => void triggerSync()}
                disabled={isSyncing}
                title="Clique para sincronizar agora"
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-2.5 py-1 rounded-full cursor-pointer transition"
              >
                {isSyncing
                  ? 'Sincronizando...'
                  : `${pendingCount} pendente(s)`}
              </button>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <span className="text-xs font-medium text-slate-600 hidden sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Carregando...
      </div>
    );
  }

  // Na tela de login, renderiza sem barra de navegação e sem disparar chamadas protegidas
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <NetworkProvider>
      <VisitProvider>
        <NotificationProvider>
          <NavigationHeader />
          {children}
        </NotificationProvider>
      </VisitProvider>
    </NetworkProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}