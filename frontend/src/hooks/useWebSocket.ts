import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketClient } from '../services/websocket/WebSocketClient';
import { useAuth } from './useAuth';

import { API_BASE_URL } from '../lib/axios';

export type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

export function useWebSocket(sessionId?: string) {
  const { token } = useAuth();
  const wsRef = useRef<WebSocketClient | null>(null);
  
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !token) return;

    // Build WebSocket URL
    // Handle both local development (http://localhost:8000 -> ws://localhost:8000)
    // and production (https://... -> wss://...)
    // If API_BASE_URL starts with '/', we prepend window.location.origin
    const base = API_BASE_URL.startsWith('/') ? window.location.origin + API_BASE_URL : API_BASE_URL;
    const wsUrl = base.replace('http', 'ws').replace('/api/v1', '') + `/api/v1/ws/interviews/${sessionId}`;
    
    wsRef.current = new WebSocketClient(wsUrl);
    const client = wsRef.current;

    setConnectionState('connecting');
    client.connect(token);

    // Register internal lifecycle listeners
    const onConnected = () => {
      setConnectionState('connected');
      setError(null);
    };

    const onDisconnected = (payload: any) => {
      setConnectionState('disconnected');
      if (payload.code === 1008) {
        setError('Authentication failed');
      }
    };

    const onReconnecting = () => {
      setConnectionState('reconnecting');
    };

    const onError = (payload: any) => {
      setConnectionState('error');
      setError(payload?.message || 'Connection error');
    };

    client.subscribe('system.connected', onConnected);
    client.subscribe('system.disconnected', onDisconnected);
    client.subscribe('system.reconnecting', onReconnecting);
    client.subscribe('connection.error', onError);

    return () => {
      client.unsubscribe('system.connected', onConnected);
      client.unsubscribe('system.disconnected', onDisconnected);
      client.unsubscribe('system.reconnecting', onReconnecting);
      client.unsubscribe('connection.error', onError);
      client.disconnect();
      wsRef.current = null;
    };
  }, [sessionId, token]);

  const send = useCallback((type: string, payload?: any) => {
    if (wsRef.current) {
      return wsRef.current.send(type, payload);
    }
    return false;
  }, []);

  const subscribe = useCallback((type: string, handler: (payload: any) => void) => {
    if (wsRef.current) {
      wsRef.current.subscribe(type, handler);
    }
  }, []);

  const unsubscribe = useCallback((type: string, handler: (payload: any) => void) => {
    if (wsRef.current) {
      wsRef.current.unsubscribe(type, handler);
    }
  }, []);

  return {
    connectionState,
    error,
    send,
    subscribe,
    unsubscribe,
    wsClient: wsRef.current,
  };
}
