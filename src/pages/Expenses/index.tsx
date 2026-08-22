import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Receipt, Wallet, Filter, Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import { useExpenseStore } from '@/store/expenseStore'
import { EXPENSE_CATEGORIES } from '@/types/trip'
import { formatMoney } from '@/utils/budget'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export default function ExpensesPage() {
  const currency = useAppStore((s) => s.currency)
  const { items, add, remove, clear, total, byCategory } = useExpenseStore()
  const [filter, setFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(true)

  const filtered = useMemo(() => {
    if (filter === 'all') return items
    if (filter === 'actual') return items.filter((x) => !x.is_estimated)
    if (filter === 'estimated') return items.filter((x) => x.is_estimated)
    return items.filter((x) => x.category === filter)
  }, [items, filter])

  const sum = total()
  const cats = byCategory()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Receipt className="h-7 w-7 text-sky-600" /> Expense tracker
          </h1>
          <p className="mt-1 text-slate-500">
            Log spending on your phone. Data stays on this device until you attach it to a trip.
          </p>
        </div>
        <Link to="/budget">
          <Button variant="outline" size="sm">
            <Wallet className="h-4 w-4" /> Planner
          </Button>
        </Link>
      </div>

      <Card className="mb-6 border-sky-200 dark:border-sky-900">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total logged</p>
              <p className="text-2xl font-bold">{formatMoney(sum, currency)}</p>
              <p className="text-xs text-slate-500">{items.length} expense{items.length !== 1 ? 's' : ''}</p>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => {
                  if (confirm('Clear all local expenses?')) clear()
                }}
              >
                <Trash2 className="h-4 w-4" /> Clear all
              </Button>
            )}
          </div>
          {Object.keys(cats).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(cats).map(([cat, amt]) => (
                <span
                  key={cat}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs dark:bg-slate-800"
                >
                  <span className="capitalize text-slate-500">
                    {EXPENSE_CATEGORIES.find((c) => c.id === cat)?.label ?? cat}
                  </span>{' '}
                  <strong>{Number(amt).toLocaleString()}</strong>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Add expense</h2>
        <Button size="sm" variant="ghost" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide form' : 'Show form'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ExpenseForm
            currency={currency}
            onSubmit={(v) => {
              add({
                title: v.title,
                amount: v.amount,
                category: v.category,
                currency,
                expense_date: v.expense_date ?? null,
                notes: v.notes ?? null,
                is_estimated: v.is_estimated,
                trip_id: null,
              })
            }}
          />
        </div>
      )}

      <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-slate-400" />
        {(['all', 'actual', 'estimated', ...EXPENSE_CATEGORIES.map((c) => c.id)] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize',
              filter === f
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 dark:border-slate-700'
            )}
          >
            {f === 'all' ? 'All' : f === 'actual' ? 'Actual' : f === 'estimated' ? 'Estimated' : f}
          </button>
        ))}
      </div>

      <ExpenseList
        items={filtered.map((x) => ({
          id: x.id,
          title: x.title,
          amount: x.amount,
          category: x.category,
          currency: x.currency,
          expense_date: x.expense_date,
          notes: x.notes,
          is_estimated: x.is_estimated,
        }))}
        onDelete={remove}
        emptyMessage="No expenses match this filter. Add one above."
      />

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
        <p className="mb-3 text-sm text-slate-500">
          Link spending to a saved itinerary for budget vs spent on that trip.
        </p>
        <Link to="/trips">
          <Button variant="outline" size="sm">
            Open trips <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
