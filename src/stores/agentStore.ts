import { create } from 'zustand';
import { AgentInstance, AgentSummary, AgentState } from '../types/agent';

interface AgentStore {
  instances: Map<string, AgentInstance>;
  summaries: AgentSummary[];
  setInstances: (instances: AgentInstance[]) => void;
  addInstance: (instance: AgentInstance) => void;
  removeInstance: (id: string) => void;
  updateState: (id: string, state: AgentState, exitCode?: number) => void;
  updateSummaries: (summaries: AgentSummary[]) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  instances: new Map(),
  summaries: [],

  setInstances: (instances) =>
    set(() => ({
      instances: new Map(instances.map((i) => [i.id, i])),
    })),

  addInstance: (instance) =>
    set((state) => {
      const next = new Map(state.instances);
      next.set(instance.id, instance);
      return { instances: next };
    }),

  removeInstance: (id) =>
    set((state) => {
      const next = new Map(state.instances);
      next.delete(id);
      return { instances: next };
    }),

  updateState: (id, newState, exitCode) =>
    set((state) => {
      const next = new Map(state.instances);
      const inst = next.get(id);
      if (inst) {
        next.set(id, {
          ...inst,
          state: newState,
          lastUpdateTime: Date.now(),
          exitCode: exitCode ?? inst.exitCode,
        });
      }
      return { instances: next };
    }),

  updateSummaries: (summaries) => set({ summaries }),
}));
