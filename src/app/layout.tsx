'use client';

import './globals.css';
import Link from 'next/link';
import { NetworkProvider, useOfflineSync } from '@/context/NetworkContext';
import { VisitProvider, useVisits } from '@/context/VisitContext';
import { NotificationProvider } from '@/context/NotificationContext';

function NavigationHeader() {
  const { isConnected } = useOfflineSync();
  const { pendingCount } = useVisits();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-slate-800">
          Pharma Sales <span className="text-blue-600 text-sm font-normal">Web</span>
        </Link>

        <div className="flex items-center gap-4">
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
              <span className="bg-orange-500 text-white px-2.5 py-1 rounded-full">
                {pendingCount} pendente(s)
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
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
        <NetworkProvider>
          <VisitProvider>
            <NotificationProvider>
              <NavigationHeader />
              {children}
            </NotificationProvider>
          </VisitProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}