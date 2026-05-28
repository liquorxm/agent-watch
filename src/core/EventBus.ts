type Listener<T = unknown> = (payload: T) => void;

export class EventBus {
  private listeners: Map<string, Set<Listener<unknown>>> = new Map();

  on<T>(event: string, listener: Listener<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as Listener<unknown>);
  }

  off<T>(event: string, listener: Listener<T>): void {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
  }

  once<T>(event: string, listener: Listener<T>): void {
    const wrapper = (payload: T) => {
      this.off(event, wrapper);
      listener(payload);
    };
    this.on(event, wrapper);
  }

  emit<T>(event: string, payload: T): void {
    this.listeners.get(event)?.forEach((listener) => {
      listener(payload);
    });
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}
