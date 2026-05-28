import { create } from 'zustand';
import { AgentInstance, AgentSummary, AgentState } from '../types/agent';

interface AgentStore {
  instances: Record<string, AgentInstance>;
  summaries: AgentSummary[];
  addInstance: (instance: AgentInstance) => void;
  removeInstance: (id: string) => void;
  updateState: (id: string, state: AgentState, exitCode?: number) => void;
  updateSummaries: (summaries: AgentSummary[]) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  instances: {},
  summaries: [],

  addInstance: (instance) =>
    set((state) => ({
      instances: { ...state.instances, [instance.id]: instance },
    })),

  removeInstance: (id) =>
    set((state) => {
      const next = { ...state.instances };
      delete next[id];
      return { instances: next };
    }),

  updateState: (id, newState, exitCode) =>
    set((state) => {
      const inst = state.instances[id];
      if (!inst) return state;
      return {
        instances: {
          ...state.instances,
          [id]: { ...inst, state: newState, lastUpdateTime: Date.now(), exitCode: exitCode ?? inst.exitCode },
        },
      };
    }),

  updateSummaries: (summaries) => set({ summaries }),
}));
