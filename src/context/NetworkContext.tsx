'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from 'react';

type SyncFn = () => Promise<void>;

interface NetworkContextData {
  isConnected: boolean;
  isSyncing: boolean;
  registerSyncHandler: (fn: SyncFn) => () => void;
  triggerSync: () => Promise<void>;
  reportApiStatus: (online: boolean) => void;
}

const NetworkContext = createContext<NetworkContextData>({} as NetworkContextData);

function subscribeNetwork(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const isBrowserOnline = useSyncExternalStore(
    subscribeNetwork,
    getSnapshot,
    getServerSnapshot
  );

  const [isApiOnline, setIsApiOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handlersRef = useRef<Set<SyncFn>>(new Set());
  const isSyncingRef = useRef<boolean>(false);
  const wasOfflineRef = useRef<boolean>(false);

  const isConnected = isBrowserOnline && isApiOnline;

  const reportApiStatus = useCallback((online: boolean) => {
    setIsApiOnline(online);
  }, []);

  const triggerSync = useCallback(async () => {
    if (handlersRef.current.size === 0 || isSyncingRef.current) return;

    isSyncingRef.current = true;
    setIsSyncing(true);
    try {
      for (const fn of handlersRef.current) {
        try {
          await fn();
        } catch (err) {
          console.error('Erro em handler de sync:', err);
        }
      }
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, []);

  const registerSyncHandler = useCallback(
    (fn: SyncFn) => {
      handlersRef.current.add(fn);

      // Dispara sincronização inicial ao carregar/recarregar a página
      if (navigator.onLine) {
        void triggerSync();
      }

      return () => {
        handlersRef.current.delete(fn);
      };
    },
    [triggerSync]
  );

  // Dispara quando a rede do navegador volta
  useEffect(() => {
    if (isBrowserOnline && wasOfflineRef.current) {
      wasOfflineRef.current = false;
      void triggerSync();
    } else if (!isBrowserOnline) {
      wasOfflineRef.current = true;
    }
  }, [isBrowserOnline, triggerSync]);

  // Tenta reconectar a cada 8s se a API estiver fora do ar
  useEffect(() => {
    if (!isBrowserOnline || isApiOnline) return;

    const interval = setInterval(() => {
      void triggerSync();
    }, 8000);

    return () => clearInterval(interval);
  }, [isBrowserOnline, isApiOnline, triggerSync]);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isSyncing,
        registerSyncHandler,
        triggerSync,
        reportApiStatus,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export const useOfflineSync = () => useContext(NetworkContext);