import type { Lang } from './strings'

/** Form & input placeholders (EN + AM) — use with useAppStore language */
export const ph = {
  en: {
    tripTitle: 'Trip title (e.g. Weekend in Bahir Dar)',
    tripBudget: 'Budget (ETB)',
    tripTravelers: 'Travelers',
    expenseWhat: 'What did you spend on?',
    expenseAmount: (currency: string) => `Amount (${currency})`,
    expenseNotes: 'Notes (optional)',
    reviewTitle: 'Sum up your experience',
    reviewComment: 'What should visitors know?',
    stopName: 'Stop name',
    email: 'you@example.com',
    password: 'Password',
    fullName: 'Your full name',
    businessName: 'Business name *',
    contactName: 'Contact name',
    discoverLive: 'Discover (live map)',
  },
  am: {
    tripTitle: 'የጉዞ ርዕስ (ለምሳሌ፡ የሳምንት መጨረሻ በባሕር ዳር)',
    tripBudget: 'በጀት (ብር)',
    tripTravelers: 'ተጓዦች',
    expenseWhat: 'በምን ላይ አውጥተዋል?',
    expenseAmount: (currency: string) => `መጠን (${currency})`,
    expenseNotes: 'ማስታወሻ (አማራጭ)',
    reviewTitle: 'ተሞክሮዎን አጭር ይግለጹ',
    reviewComment: 'ጎብኝዎች ምን ማወቅ አለባቸው?',
    stopName: 'የማቆሚያ ስም',
    email: 'you@example.com',
    password: 'የይለፍ ቃል',
    fullName: 'ሙሉ ስምዎ',
    businessName: 'የንግድ ስም *',
    contactName: 'የእውቂያ ስም',
    discoverLive: 'አግኝ (ቀጥታ ካርታ)',
  },
} as const

export function usePlaceholders(lang: Lang) {
  return ph[lang] ?? ph.en
}
