import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/types/trip'

export type ExpenseFormValues = {
  title: string
  amount: number
  category: ExpenseCategory | string
  expense_date?: string
  notes?: string
  is_estimated: boolean
}

type Props = {
  currency?: string
  defaultCategory?: string
  onSubmit: (values: ExpenseFormValues) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  pending?: boolean
}

export function ExpenseForm({
  currency = 'ETB',
  defaultCategory = 'food',
  onSubmit,
  onCancel,
  submitLabel = 'Add expense',
  pending,
}: Props) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(defaultCategory)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [isEstimated, setIsEstimated] = useState(true)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Number(amount)
    if (!title.trim() || !Number.isFinite(amt) || amt < 0) return
    await onSubmit({
      title: title.trim(),
      amount: amt,
      category,
      expense_date: date || undefined,
      notes: notes.trim() || undefined,
      is_estimated: isEstimated,
    })
    setTitle('')
    setAmount('')
    setNotes('')
    setIsEstimated(true)
  }

  return (
    <form
      onSubmit={handle}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What did you spend on?"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
        required
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Amount (${currency})`}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 sm:col-span-1"
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        rows={2}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
      />
      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={isEstimated}
          onChange={(e) => setIsEstimated(e.target.checked)}
          className="rounded border-slate-300"
        />
        Estimated (not final receipt)
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
