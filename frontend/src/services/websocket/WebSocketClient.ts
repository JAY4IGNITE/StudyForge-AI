type EventHandler = (payload: any) => void;

export interface WebSocketMessage {
  type: string;
  event_id?: string;
  timestamp?: string;
  payload: any;
}

export class WebSocketClient {
  private url: string;
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 7;
  private baseReconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private isIntentionalDisconnect = false;

  constructor(url: string) {
    this.url = url;
  }

  public connect(token: string) {
    this.token = token;
    this.isIntentionalDisconnect = false;
    this.reconnectAttempts = 0;
    this.initWebSocket();
  }

  private initWebSocket() {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        // Phase 4: Authentication via first message
        if (this.token) {
          this.ws?.send(JSON.stringify({ type: 'auth', token: this.token }));
        }
        
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.emit('system.connected', {});
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          if (data.type === 'pong') {
            // Heartbeat acknowledged
            return;
          }
          
          this.emit(data.type, data.payload);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        this.stopHeartbeat();
        this.emit('system.disconnected', { code: event.code, reason: event.reason });
        
        // 1008 is policy violation (e.g. auth failed). Do not reconnect.
        if (!this.isIntentionalDisconnect && event.code !== 1008) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        this.emit('system.error', error);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('system.reconnect_failed', {});
      return;
    }

    const delay = Math.min(this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts), 30000);
    // Add jitter (±20%)
    const jitter = delay * 0.2 * (Math.random() * 2 - 1);
    const finalDelay = delay + jitter;

    this.reconnectAttempts++;
    this.emit('system.reconnecting', { attempt: this.reconnectAttempts, delay: finalDelay });

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.initWebSocket();
    }, finalDelay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public disconnect() {
    this.isIntentionalDisconnect = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Intentional disconnect');
      this.ws = null;
    }
  }

  public send(type: string, payload: any = {}) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
      return true;
    }
    return false;
  }

  public subscribe(type: string, handler: EventHandler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);
  }

  public unsubscribe(type: string, handler: EventHandler) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  private emit(type: string, payload: any) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
    
    // Also emit to catch-all '*' listener if exists
    const catchAll = this.listeners.get('*');
    if (catchAll) {
      catchAll.forEach((handler) => handler({ type, payload }));
    }
  }
}
