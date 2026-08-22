import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExpenseCategory } from '@/types/trip'

export type LocalExpense = {
  id: string
  title: string
  amount: number
  category: ExpenseCategory | string
  currency: string
  expense_date: string | null
  notes: string | null
  is_estimated: boolean
  trip_id: string | null
  created_at: string
}

type ExpenseState = {
  items: LocalExpense[]
  add: (e: Omit<LocalExpense, 'id' | 'created_at'>) => LocalExpense
  remove: (id: string) => void
  update: (id: string, patch: Partial<LocalExpense>) => void
  clear: () => void
  total: () => number
  byCategory: () => Record<string, number>
}

function uid() {
  return `lex-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (e) => {
        const row: LocalExpense = {
          ...e,
          id: uid(),
          created_at: new Date().toISOString(),
        }
        set((s) => ({ items: [row, ...s.items] }))
        return row
      },
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, x) => sum + (Number(x.amount) || 0), 0),
      byCategory: () => {
        const out: Record<string, number> = {}
        for (const x of get().items) {
          const c = x.category || 'other'
          out[c] = (out[c] ?? 0) + (Number(x.amount) || 0)
        }
        return out
      },
    }),
    { name: 'dbd-local-expenses' }
  )
)
