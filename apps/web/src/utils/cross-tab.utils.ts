export enum CrossTabEvent {
  EmailVerified = "email-verified",
  AuthStateChanged = "auth-state-changed",
}

export interface CrossTabMessage {
  type: CrossTabEvent;
  payload?: any;
  timestamp: number;
}

class CrossTabCommunication {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<CrossTabEvent, Set<(payload: any) => void>> =
    new Map();

  constructor() {
    this.initChannel();
    this.setupStorageFallback();
  }

  private initChannel() {
    if (typeof BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel("matcha-app");
      this.channel.onmessage = (event: MessageEvent<CrossTabMessage>) => {
        this.handleMessage(event.data);
      };
    }
  }

  private setupStorageFallback() {
    if (!this.channel) {
      window.addEventListener("storage", (event) => {
        if (event.key === "matcha-cross-tab" && event.newValue) {
          try {
            const message: CrossTabMessage = JSON.parse(event.newValue);
            this.handleMessage(message);
          } catch (error) {
            console.error("Failed to parse cross-tab message:", error);
          }
        }
      });
    }
  }

  private handleMessage(message: CrossTabMessage) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach((callback) => callback(message.payload));
    }
  }

  public broadcast(type: CrossTabEvent, payload?: any) {
    const message: CrossTabMessage = {
      type,
      payload,
      timestamp: Date.now(),
    };

    if (this.channel) {
      this.channel.postMessage(message);
    } else {
      localStorage.setItem("matcha-cross-tab", JSON.stringify(message));
      setTimeout(() => {
        localStorage.removeItem("matcha-cross-tab");
      }, 100);
    }
  }

  public on(type: CrossTabEvent, callback: (payload: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  public off(type: CrossTabEvent, callback: (payload: any) => void) {
    this.listeners.get(type)?.delete(callback);
  }

  public destroy() {
    if (this.channel) {
      this.channel.close();
    }
    this.listeners.clear();
  }
}

export const crossTab = new CrossTabCommunication();
