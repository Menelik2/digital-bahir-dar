export type TripStatus = 'planning' | 'active' | 'completed' | 'archived'

export type ExpenseCategory =
  | 'lodging'
  | 'food'
  | 'transport'
  | 'attraction'
  | 'shopping'
  | 'other'

export interface Trip {
  id: string
  user_id: string
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
  traveler_count: number
  budget_total: number | null
  currency: string
  status: TripStatus
  is_public: boolean
  created_at: string
  updated_at: string
  days?: TripDay[]
  expenses?: TripExpense[]
}

export interface TripDay {
  id: string
  trip_id: string
  day_number: number
  date: string | null
  title: string | null
  notes: string | null
  created_at: string
  stops?: TripStop[]
}

export interface TripStop {
  id: string
  trip_day_id: string
  place_id: string | null
  custom_name: string | null
  sort_order: number
  start_time: string | null
  end_time: string | null
  notes: string | null
  estimated_cost: number | null
  created_at: string
  place?: { id: string; name: string; slug: string; latitude: number; longitude: number } | null
}

export interface TripExpense {
  id: string
  trip_id: string
  category: ExpenseCategory | string
  title: string
  amount: number
  currency: string
  expense_date: string | null
  notes: string | null
  is_estimated: boolean
  created_at: string
  updated_at: string
}

export interface TripInput {
  title: string
  description?: string
  start_date?: string
  end_date?: string
  traveler_count?: number
  budget_total?: number
  currency?: string
  status?: TripStatus
}

export interface BudgetBreakdown {
  byCategory: Record<string, number>
  /** Projected total = logged expenses + stop estimates */
  totalExpenses: number
  /** Sum of trip_expenses only (excludes stop estimates) */
  loggedExpenses?: number
  budgetTotal: number | null
  remaining: number | null
  perPerson: number | null
  currency: string
  /** Optional extensions from sumTripSpending */
  estimatedOnly?: number
  actualOnly?: number
  stopEstimates?: number
  usedPercent?: number | null
  travelers?: number
}

export const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string }[] = [
  { id: 'lodging', label: 'Lodging' },
  { id: 'food', label: 'Food' },
  { id: 'transport', label: 'Transport' },
  { id: 'attraction', label: 'Attractions' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'other', label: 'Other' },
]
