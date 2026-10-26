import './globals.css';
import { NetworkProvider } from '@/context/NetworkContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { VisitProvider } from '@/context/VisitContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <NetworkProvider>
          <NotificationProvider>
            <VisitProvider>
              {children}
            </VisitProvider>
          </NotificationProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}