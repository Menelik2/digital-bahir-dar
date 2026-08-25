import { z } from 'zod'
import type { TripInput } from '@/types/trip'

export const tripCreateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(80, 'Title must be at most 80 characters'),
    description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
    start_date: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: 'Use date format YYYY-MM-DD' }),
    end_date: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: 'Use date format YYYY-MM-DD' }),
    traveler_count: z.coerce
      .number()
      .int('Travelers must be a whole number')
      .min(1, 'At least 1 traveler')
      .max(50, 'Maximum 50 travelers'),
    budget_total: z.preprocess(
      (v) => (v === '' || v === null || v === undefined ? undefined : v),
      z.coerce
        .number()
        .finite()
        .min(0, 'Budget cannot be negative')
        .max(50_000_000, 'Budget is too large')
        .optional()
    ),
    currency: z.string().trim().length(3).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date && data.end_date < data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be on or after start date',
        path: ['end_date'],
      })
    }
  })

export type FieldErrors = Partial<Record<string, string>>

export function parseTripCreate(input: {
  title: string
  budget?: string | number
  travelers?: string | number
  description?: string
  start_date?: string
  end_date?: string
  currency?: string
}): { ok: true; data: TripInput } | { ok: false; errors: FieldErrors; message: string } {
  const raw = {
    title: input.title ?? '',
    description: input.description?.trim() || undefined,
    start_date: input.start_date?.trim() || undefined,
    end_date: input.end_date?.trim() || undefined,
    traveler_count:
      input.travelers === '' || input.travelers === undefined || input.travelers === null
        ? 1
        : input.travelers,
    budget_total:
      input.budget === '' || input.budget === undefined || input.budget === null
        ? undefined
        : input.budget,
    currency: input.currency?.trim() || 'ETB',
  }

  const result = tripCreateSchema.safeParse(raw)
  if (!result.success) {
    const errors: FieldErrors = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!errors[key]) errors[key] = issue.message
    }
    return { ok: false, errors, message: result.error.issues[0]?.message ?? 'Please fix the form' }
  }

  const v = result.data
  return {
    ok: true,
    data: {
      title: v.title,
      description: v.description,
      start_date: v.start_date,
      end_date: v.end_date,
      traveler_count: v.traveler_count,
      budget_total: v.budget_total,
      currency: v.currency || 'ETB',
    },
  }
}

export const expenseSchema = z.object({
  title: z.string().trim().min(1, 'Expense title is required').max(100),
  amount: z.coerce.number().finite().positive('Amount must be greater than 0').max(50_000_000),
  category: z.string().trim().min(1, 'Category is required'),
  currency: z.string().trim().length(3).optional(),
  notes: z.string().trim().max(300).optional(),
})

export function parseExpense(input: {
  title: string
  amount: string | number
  category: string
  currency?: string
  notes?: string
}): { ok: true; data: z.infer<typeof expenseSchema> } | { ok: false; errors: FieldErrors; message: string } {
  const result = expenseSchema.safeParse(input)
  if (!result.success) {
    const errors: FieldErrors = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!errors[key]) errors[key] = issue.message
    }
    return { ok: false, errors, message: result.error.issues[0]?.message ?? 'Invalid expense' }
  }
  return { ok: true, data: result.data }
}
