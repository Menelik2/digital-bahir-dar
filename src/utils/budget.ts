/**
 * Money budget calculations for Digital Bahir Dar.
 *
 * Two modes:
 * 1) estimateTripBudget — planning calculator (Budget page)
 * 2) sumTripSpending — actual/estimated expenses + stop costs (Trips)
 *
 * All amounts are in the trip/planner currency (default ETB).
 */

import type { ExpenseCategory, Trip, TripExpense, BudgetBreakdown } from '@/types/trip'

export type BudgetEstimateInput = {
  travelers: number
  nights: number
  /** Room rate per night (one room). Rooms ≈ ceil(travelers / 2). */
  lodgingPerNight: number
  /** Food cost per person per day */
  foodPerDay: number
  /** Total transport for the whole trip (shared) */
  transportTotal: number
  /** Attractions / activities per person (trip total) */
  attractionsPerPerson: number
  /** Shopping total (shared) */
  shopping: number
  /** Misc total (shared) */
  other: number
  /** Optional max budget */
  budgetCap?: number
  /** Days of food: default nights + 1 (arrival day) */
  foodDays?: number
}

export type BudgetEstimateResult = {
  lodging: number
  food: number
  transport: number
  attraction: number
  shopping: number
  other: number
  /** Sum of all categories */
  total: number
  perPerson: number
  perDay: number
  rooms: number
  foodDays: number
  budgetCap: number | null
  remaining: number | null
  /** 0–100+ ; >100 means over budget */
  usedPercent: number | null
  byCategory: Record<ExpenseCategory, number>
}

function n(v: unknown): number {
  const x = Number(v)
  return Number.isFinite(x) && x > 0 ? x : 0
}

function clampTravelers(t: number): number {
  return Math.max(1, Math.floor(n(t)) || 1)
}

/**
 * Estimate a Bahir Dar trip budget from simple inputs.
 *
 * Formulas:
 * - rooms = ceil(travelers / 2)
 * - lodging = lodgingPerNight × nights × rooms
 * - foodDays = foodDays ?? (nights + 1)
 * - food = foodPerDay × foodDays × travelers
 * - transport = transportTotal (shared)
 * - attraction = attractionsPerPerson × travelers
 * - shopping, other = as entered (shared)
 * - total = sum of categories
 * - perPerson = total / travelers
 * - perDay = total / max(foodDays, 1)
 * - remaining = budgetCap − total (if cap set)
 */
export function estimateTripBudget(input: BudgetEstimateInput): BudgetEstimateResult {
  const travelers = clampTravelers(input.travelers)
  const nights = Math.max(0, Math.floor(n(input.nights)))
  const rooms = Math.max(1, Math.ceil(travelers / 2))
  const foodDays = Math.max(1, input.foodDays != null ? Math.floor(n(input.foodDays)) : nights + 1)

  const lodging = n(input.lodgingPerNight) * nights * rooms
  const food = n(input.foodPerDay) * foodDays * travelers
  const transport = n(input.transportTotal)
  const attraction = n(input.attractionsPerPerson) * travelers
  const shopping = n(input.shopping)
  const other = n(input.other)

  const total = lodging + food + transport + attraction + shopping + other
  const perPerson = total / travelers
  const perDay = total / foodDays

  const budgetCap =
    input.budgetCap != null && Number.isFinite(Number(input.budgetCap))
      ? Math.max(0, Number(input.budgetCap))
      : null
  const remaining = budgetCap != null ? budgetCap - total : null
  const usedPercent =
    budgetCap != null && budgetCap > 0 ? Math.round((total / budgetCap) * 1000) / 10 : null

  const byCategory: Record<ExpenseCategory, number> = {
    lodging,
    food,
    transport,
    attraction,
    shopping,
    other,
  }

  return {
    lodging,
    food,
    transport,
    attraction,
    shopping,
    other,
    total,
    perPerson,
    perDay,
    rooms,
    foodDays,
    budgetCap,
    remaining,
    usedPercent,
    byCategory,
  }
}

/**
 * Sum logged trip expenses + optional stop estimated costs.
 * Stop costs are added under category "other" unless already counted in expenses.
 */
export function sumTripSpending(trip: Trip): BudgetBreakdown {
  const expenses = trip.expenses ?? []
  const byCategory: Record<string, number> = {}
  let totalExpenses = 0
  let estimatedOnly = 0
  let actualOnly = 0

  for (const e of expenses) {
    const amt = n(e.amount)
    const cat = (e.category || 'other').toString()
    byCategory[cat] = (byCategory[cat] ?? 0) + amt
    totalExpenses += amt
    if (e.is_estimated) estimatedOnly += amt
    else actualOnly += amt
  }

  let stopEstimates = 0
  for (const day of trip.days ?? []) {
    for (const stop of day.stops ?? []) {
      if (stop.estimated_cost != null) {
        const amt = n(stop.estimated_cost)
        stopEstimates += amt
        byCategory.other = (byCategory.other ?? 0) + amt
        totalExpenses += amt
        estimatedOnly += amt
      }
    }
  }

  const travelers = clampTravelers(trip.traveler_count)
  const budgetTotal = trip.budget_total != null ? n(trip.budget_total) : null
  const remaining = budgetTotal != null ? budgetTotal - totalExpenses : null
  const perPerson = totalExpenses / travelers
  const usedPercent =
    budgetTotal != null && budgetTotal > 0
      ? Math.round((totalExpenses / budgetTotal) * 1000) / 10
      : null

  return {
    byCategory,
    totalExpenses,
    budgetTotal,
    remaining,
    perPerson,
    currency: trip.currency || 'ETB',
    estimatedOnly,
    actualOnly,
    stopEstimates,
    usedPercent,
    travelers,
  }
}

/** Format money for display */
export function formatMoney(amount: number, currency = 'ETB', locale = 'en-ET'): string {
  const v = Number.isFinite(amount) ? amount : 0
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === 'ETB' ? 'ETB' : currency,
      maximumFractionDigits: 0,
    }).format(v)
  } catch {
    return `${Math.round(v).toLocaleString()} ${currency}`
  }
}

/** Quick daily burn rate from remaining budget and days left */
export function dailyBudgetRemaining(
  remaining: number | null,
  daysLeft: number
): number | null {
  if (remaining == null || daysLeft <= 0) return null
  return remaining / daysLeft
}

/** Group expenses for charts */
export function expensesByCategory(expenses: TripExpense[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const e of expenses) {
    const cat = (e.category || 'other').toString()
    out[cat] = (out[cat] ?? 0) + n(e.amount)
  }
  return out
}
