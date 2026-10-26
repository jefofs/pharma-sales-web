'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';

type SyncFn = () => Promise<void>;

interface NetworkContextData {
  isConnected: boolean;
  isSyncing: boolean;
  registerSyncHandler: (fn: SyncFn) => () => void;
  triggerSync: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextData>({} as NetworkContextData);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const handlersRef = useRef<Set<SyncFn>>(new Set());
  const wasOfflineRef = useRef<boolean>(false);

  const triggerSync = useCallback(async () => {
    if (handlersRef.current.size === 0) return;
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
      setIsSyncing(false);
    }
  }, []);

  const registerSyncHandler = useCallback((fn: SyncFn) => {
    handlersRef.current.add(fn);
    return () => {
      handlersRef.current.delete(fn);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Estado inicial da conexão do navegador
    const connected = navigator.onLine;
    setIsConnected(connected);
    wasOfflineRef.current = !connected;

    const handleOnline = () => {
      setIsConnected(true);
      if (wasOfflineRef.current) {
        wasOfflineRef.current = false;
        triggerSync();
      }
    };

    const handleOffline = () => {
      setIsConnected(false);
      wasOfflineRef.current = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync]);

  return (
    <NetworkContext.Provider
      value={{ isConnected, isSyncing, registerSyncHandler, triggerSync }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export const useOfflineSync = () => useContext(NetworkContext);