import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TodoState {
  completed: Record<string, boolean>
  toggle: (id: string) => void
  markDone: (id: string) => void
  reset: () => void
  completedCount: () => number
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      completed: {},
      toggle: (id) =>
        set((s) => ({
          completed: { ...s.completed, [id]: !s.completed[id] },
        })),
      markDone: (id) => set((s) => ({ completed: { ...s.completed, [id]: true } })),
      reset: () => set({ completed: {} }),
      completedCount: () => Object.values(get().completed).filter(Boolean).length,
    }),
    { name: 'dbd-city-todos' }
  )
)
