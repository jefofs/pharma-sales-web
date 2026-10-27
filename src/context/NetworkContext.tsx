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
}

const NetworkContext = createContext<NetworkContextData>({} as NetworkContextData);

// Funções para assinar o evento 'online/offline' do navegador sem gerar re-renders desnecessários
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
  return true; // Padrão seguro para SSR no servidor
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  // Hook oficial do React para APIs externas do navegador
  const isConnected = useSyncExternalStore(
    subscribeNetwork,
    getSnapshot,
    getServerSnapshot
  );

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

  // Monitora a transição de offline -> online para disparar a sincronização
  useEffect(() => {
    if (isConnected && wasOfflineRef.current) {
      wasOfflineRef.current = false;
      triggerSync();
    } else if (!isConnected) {
      wasOfflineRef.current = true;
    }
  }, [isConnected, triggerSync]);

  return (
    <NetworkContext.Provider
      value={{ isConnected, isSyncing, registerSyncHandler, triggerSync }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export const useOfflineSync = () => useContext(NetworkContext);