import enJson from './en.json' with { type: 'json' }
import amJson from './am.json' with { type: 'json' }

export type Lang = 'en' | 'am'

/**
 * UI string pack. Typed loosely so pages can use keys that are still being
 * restored into en.json / am.json without blocking production builds.
 * Runtime access is also guarded by the safe proxy in useT().
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Strings = any

const profileFixes = {
  en: {
    signInPrompt:
      'Sign in to save places, write reviews, and manage trips.',
    subtitle:
      'Sign in to save places, write reviews, and manage trips.',
  },
  am: {
    signInPrompt: 'ቦታዎችን ለማስቀመጥ፣ ግምገማ ለመጻፍ እና ጉዞዎችን ለማስተዳደር ይግቡ።',
    subtitle: 'ቦታዎችን ለማስቀመጥ፣ ግምገማ ለመጻፍ እና ጉዞዎችን ለማስተዳደር ይግቡ።',
  },
} as const

const plannerFixes = {
  en: {
    title: 'Trip planner',
    subtitle: 'Build a day-by-day Bahir Dar itinerary — boat, falls, food, and more.',
    start: 'Get started',
    buildPlan: 'Build my plan',
    howManyDays: 'How many days?',
    travelers: 'Travelers',
    budgetStyle: 'Budget style',
    budgetBudget: 'Budget',
    budgetBudgetHint: 'Simple stays & local meals',
    budgetMid: 'Mid-range',
    budgetMidHint: 'Comfortable hotels & mix of dining',
    budgetComfort: 'Comfort',
    budgetComfortHint: 'Top hotels & guided experiences',
    pace: 'Pace',
    paceRelaxed: 'Relaxed',
    paceModerate: 'Moderate',
    paceActive: 'Active',
    interests: 'Interests',
    nature: 'Nature',
    culture: 'Culture',
    food: 'Food',
    shopping: 'Shopping',
    photos: 'Photos',
    family: 'Family',
    includeBoat: 'Include boat trip',
    includeFalls: 'Include Blue Nile Falls',
    offlineNote: 'Works offline — plan is generated on your device.',
    estimatedTotal: 'Estimated total',
    perPerson: 'per person',
    day: 'Day',
    stopsAcross: 'stops across',
    editChoices: 'Edit choices',
    copy: 'Copy plan',
    copied: 'Copied!',
    generateAi: 'Write a travel story',
    writing: 'Writing…',
    tips: 'Tips',
    disclaimer: 'Estimates only — prices change. Confirm on the ground.',
  },
  am: {
    title: 'የጉዞ እቅድ',
    subtitle: 'የቀን በቀን የባሕር ዳር እቅድ — ጀልባ፣ ፏፏቴ፣ ምግብ እና ተጨማሪ።',
    start: 'ይጀምሩ',
    buildPlan: 'እቅዴን ግንባ',
    howManyDays: 'ስንት ቀናት?',
    travelers: 'ተጓዦች',
    budgetStyle: 'የበጀት ዘይቤ',
    budgetBudget: 'በጀት',
    budgetBudgetHint: 'ቀላል ማደሪያ እና የአካባቢ ምግብ',
    budgetMid: 'መካከለኛ',
    budgetMidHint: 'ምቹ ሆቴል እና የተደባለቀ ምግብ',
    budgetComfort: 'ምቾት',
    budgetComfortHint: 'ከፍተኛ ሆቴል እና መሪ ጉዞ',
    pace: 'ፍጥነት',
    paceRelaxed: 'ዘና ያለ',
    paceModerate: 'መካከለኛ',
    paceActive: 'ንቁ',
    interests: 'ፍላጎቶች',
    nature: 'ተፈጥሮ',
    culture: 'ባህል',
    food: 'ምግብ',
    shopping: 'ግዢ',
    photos: 'ፎቶ',
    family: 'ቤተሰብ',
    includeBoat: 'የጀልባ ጉዞ አካትት',
    includeFalls: 'የአባይ ፏፏቴ አካትት',
    offlineNote: 'ኦፍላይን ይሰራል — እቅዱ በመሣሪያዎ ላይ ይፈጠራል።',
    estimatedTotal: 'ግምታዊ ድምር',
    perPerson: 'በሰው',
    day: 'ቀን',
    stopsAcross: 'ማቆሚያዎች በ',
    editChoices: 'ምርጫዎችን አርትዕ',
    copy: 'እቅድ ቅዳ',
    copied: 'ተቀድቷል!',
    generateAi: 'የጉዞ ታሪክ ጻፍ',
    writing: 'በመጻፍ ላይ…',
    tips: 'ምክሮች',
    disclaimer: 'ግምቶች ብቻ — ዋጋዎች ይለወጣሉ። በቦታው ያረጋግጡ።',
  },
} as const

function withFixes(lang: Lang, pack: Record<string, unknown>): Strings {
  const profile = {
    ...((pack.profile as Record<string, unknown>) ?? {}),
    ...profileFixes[lang],
  }
  const planner = {
    ...plannerFixes[lang],
    ...((pack.planner as Record<string, unknown>) ?? {}),
  }
  return { ...pack, profile, planner }
}

export const strings: Record<Lang, Strings> = {
  en: withFixes('en', enJson as Record<string, unknown>),
  am: withFixes('am', amJson as Record<string, unknown>),
}
