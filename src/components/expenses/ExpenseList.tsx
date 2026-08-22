import { Trash2 } from 'lucide-react'
import { EXPENSE_CATEGORIES } from '@/types/trip'
import { cn } from '@/lib/utils'

export type ExpenseRow = {
  id: string
  title: string
  amount: number
  category: string
  currency: string
  expense_date?: string | null
  notes?: string | null
  is_estimated?: boolean
}

type Props = {
  items: ExpenseRow[]
  onDelete?: (id: string) => void
  emptyMessage?: string
}

function label(cat: string) {
  return EXPENSE_CATEGORIES.find((c) => c.id === cat)?.label ?? cat
}

export function ExpenseList({ items, onDelete, emptyMessage = 'No expenses yet.' }: Props) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">{emptyMessage}</p>
  }

  return (
    <ul className="space-y-2">
      {items.map((exp) => (
        <li
          key={exp.id}
          className="flex items-start gap-3 rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800"
        >
          <span className="mt-0.5 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize dark:bg-slate-800">
            {label(exp.category)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{exp.title}</p>
            <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-slate-400">
              {exp.expense_date && <span>{exp.expense_date}</span>}
              {exp.is_estimated && <span className="text-amber-600">estimated</span>}
              {!exp.is_estimated && <span className="text-emerald-600">actual</span>}
              {exp.notes && <span className="truncate">{exp.notes}</span>}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold">
            {Number(exp.amount).toLocaleString()} {exp.currency}
          </span>
          {onDelete && (
            <button
              type="button"
              className={cn('shrink-0 text-slate-400 hover:text-red-500')}
              onClick={() => onDelete(exp.id)}
              aria-label="Delete expense"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
