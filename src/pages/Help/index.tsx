import { Link } from 'react-router-dom'
import {
  Plane,
  Banknote,
  Smartphone,
  MapPin,
  Sun,
  Shield,
  MessageCircle,
  Phone,
  ChevronRight,
  AlertTriangle,
  Compass,
  Heart,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EMERGENCY_CONTACTS } from '@/data/cityLife'
import {
  ARRIVAL_STEPS,
  PHRASES,
  MONEY_TIPS,
  SAFETY_TIPS,
  GETTING_AROUND,
  QUICK_LINKS,
} from '@/data/visitorEssentials'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

const STEP_ICONS = [Plane, Banknote, Smartphone, Sun, MapPin]

export default function HelpPage() {
  const lang = useAppStore((s) => s.language)
  const am = lang === 'am'

  return (
    <div className="bg-[#f2f2f7] dark:bg-black">
      <section className="border-b border-black/[0.04] bg-gradient-to-br from-[#0b6e99] via-[#078930] to-[#045a1e] px-4 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl lg:text-left">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur-sm">
            <Heart className="h-3.5 w-3.5" /> {am ? 'ለጎብኝዎች' : 'For visitors'}
          </div>
          <h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-4xl">
            {am ? 'ባሕር ዳር — እርዳታና መጀመሪያ' : 'Bahir Dar — help & first steps'}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/90 lg:mx-0">
            {am
              ? 'ከትራንስፖርት እስከ ምግብ፣ ካርታ፣ አደጋ ጊዜ እና ቀላል አማርኛ — ያለ መመሪያ በቀላሉ ይጀምሩ።'
              : 'From transport to food, map, emergency numbers, and simple Amharic — start easily without a tour guide.'}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center lg:justify-start">
            <Link to="/today">
              <Button className="h-11 w-full rounded-full bg-[#f5c518] px-6 text-[#3d3200] hover:bg-[#e6b800] sm:w-auto">
                <Sun className="h-4 w-4" /> {am ? 'የዛሬ እቅድ' : 'Today’s plan'}
              </Button>
            </Link>
            <Link to="/map">
              <Button
                variant="outline"
                className="h-11 w-full rounded-full border-white/40 bg-white/10 px-6 text-white hover:bg-white/20 sm:w-auto"
              >
                <MapPin className="h-4 w-4" /> {am ? 'ካርታ ክፈት' : 'Open map'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-6 lg:max-w-4xl lg:py-12">
        <section>
          <h2 className="mb-3 text-[18px] font-bold text-[#1c1c1e] dark:text-white sm:text-xl">
            {am ? 'በፍጥነት ይሂዱ' : 'Go quickly'}
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.path}
                to={q.path}
                className="rounded-2xl bg-white px-3 py-3 text-center text-[13px] font-semibold text-[#1c1c1e] shadow-sm ring-1 ring-black/[0.04] transition active:scale-[0.98] dark:bg-[#1c1c1e] dark:text-white dark:ring-white/10"
              >
                {am ? q.labelAm : q.labelEn}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-[18px] font-bold text-[#1c1c1e] dark:text-white sm:text-xl">
            {am ? 'አሁን ደርሰዋል? 5 ደረጃዎች' : 'Just arrived? 5 steps'}
          </h2>
          <p className="mb-4 text-[13px] text-[#8e8e93]">
            {am ? 'ከአውሮፕላን ወይም ከአውቶቡስ በኋላ — በቅደም ተከተል' : 'After plane or bus — do these in order'}
          </p>
          <div className="space-y-3">
            {ARRIVAL_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Compass
              const title = am ? step.titleAm : step.titleEn
              const body = am ? step.bodyAm : step.bodyEn
              const inner = (
                <Card className="border-black/[0.04] shadow-sm dark:border-white/[0.08]">
                  <CardContent className="flex gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#078930]/12 text-[#078930] dark:bg-[#30d158]/15 dark:text-[#30d158]">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[15px] font-semibold text-[#1c1c1e] dark:text-white">
                          <span className="mr-1.5 text-[#8e8e93]">{i + 1}.</span>
                          {title}
                        </p>
                        {step.link ? <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#c7c7cc]" /> : null}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#8e8e93]">{body}</p>
                    </div>
                  </CardContent>
                </Card>
              )
              return step.link ? (
                <Link key={step.id} to={step.link} className="block transition active:scale-[0.99]">
                  {inner}
                </Link>
              ) : (
                <div key={step.id}>{inner}</div>
              )
            })}
          </div>
        </section>

        <section id="emergency" className="scroll-mt-24">
          <h2 className="mb-1 flex items-center gap-2 text-[18px] font-bold text-[#1c1c1e] dark:text-white sm:text-xl">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            {am ? 'አደጋ ጊዜ' : 'Emergency'}
          </h2>
          <p className="mb-4 text-[13px] text-[#8e8e93]">
            {am ? 'ብሔራዊ ቁጥሮች — ለማረጋገጥ ሆቴልዎንም ይጠይቁ' : 'National numbers — also ask your hotel'}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EMERGENCY_CONTACTS.slice(0, 6).map((c) => (
              <Card key={c.id} className="border-rose-100 shadow-sm dark:border-rose-900/40">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-[14px] font-semibold text-[#1c1c1e] dark:text-white">{c.name}</p>
                    <p className="text-[12px] text-[#8e8e93]">{c.role}</p>
                  </div>
                  {/^\d/.test(c.phone) ? (
                    <a
                      href={`tel:${c.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-2 text-[14px] font-bold text-white"
                    >
                      <Phone className="h-3.5 w-3.5" /> {c.phone}
                    </a>
                  ) : (
                    <span className="text-[13px] font-medium text-[#8e8e93]">{c.phone}</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-1 flex items-center gap-2 text-[18px] font-bold text-[#1c1c1e] dark:text-white sm:text-xl">
            <MessageCircle className="h-5 w-5 text-[#0b6e99]" />
            {am ? 'ጠቃሚ አማርኛ' : 'Useful Amharic'}
          </h2>
          <p className="mb-4 text-[13px] text-[#8e8e93]">
            {am ? 'ጎብኝዎች ለባጃጅ፣ ምግብ እና እርዳታ' : 'For bajaj, food, and asking for help'}
          </p>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:ring-white/10">
            {PHRASES.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  'flex items-baseline justify-between gap-3 px-4 py-3',
                  i > 0 && 'border-t border-black/[0.05] dark:border-white/[0.08]'
                )}
              >
                <div>
                  <p className="text-[14px] font-medium text-[#1c1c1e] dark:text-white">{p.en}</p>
                  {p.pronounce ? <p className="text-[11px] text-[#8e8e93]">{p.pronounce}</p> : null}
                </div>
                <p className="text-right text-[15px] font-semibold text-[#078930] dark:text-[#30d158]">{p.am}</p>
              </div>
            ))}
          </div>
        </section>

        {[MONEY_TIPS, GETTING_AROUND, SAFETY_TIPS].map((block) => (
          <section key={block.id}>
            <h2 className="mb-3 flex items-center gap-2 text-[18px] font-bold text-[#1c1c1e] dark:text-white sm:text-xl">
              {block.id === 'safety' ? <Shield className="h-5 w-5 text-[#078930]" /> : null}
              {am ? block.titleAm : block.titleEn}
            </h2>
            <ul className="space-y-2">
              {(am ? block.itemsAm : block.itemsEn).map((item, idx) => (
                <li
                  key={idx}
                  className="rounded-2xl bg-white px-4 py-3 text-[14px] leading-relaxed text-[#3c3c43] shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:text-white/85 dark:ring-white/10"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="pb-8">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#0b6e99]/15 to-[#078930]/15 shadow-sm dark:from-[#0b6e99]/25 dark:to-[#078930]/20">
            <CardContent className="p-5 sm:p-6">
              <p className="text-[17px] font-bold text-[#1c1c1e] dark:text-white">
                {am ? 'ተጨማሪ እርዳታ ይፈልጋሉ?' : 'Need more help?'}
              </p>
              <p className="mt-1 text-[13px] text-[#8e8e93]">
                {am
                  ? 'AI መመሪያ ይጠይቁ ወይም ሙሉ ማውጫውን ይክፈቱ።'
                  : 'Ask the AI Guide or open the full city directory.'}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link to="/ai-guide" className="w-full sm:w-auto">
                  <Button className="h-11 w-full rounded-full bg-[#078930] hover:bg-[#056b24] sm:w-auto">
                    {am ? 'AI መመሪያ' : 'AI Guide'}
                  </Button>
                </Link>
                <Link to="/directory" className="w-full sm:w-auto">
                  <Button variant="outline" className="h-11 w-full rounded-full sm:w-auto">
                    {am ? 'ማውጫ' : 'Directory'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
