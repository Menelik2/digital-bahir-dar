import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useT } from '@/hooks/useT'
import { useAppStore } from '@/store'
import { usePlaceholders } from '@/i18n/formPlaceholders'
import { cn } from '@/lib/utils'

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
const registerSchema = loginSchema.extend({ fullName: z.string().min(2) })
type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

const inputClass =
  'w-full min-h-[48px] rounded-xl border border-black/[0.08] bg-white px-4 text-[16px] outline-none transition focus:border-[#078930] focus:ring-2 focus:ring-[#078930]/20 dark:border-white/10 dark:bg-[#2c2c2e] dark:focus:border-[#30d158] dark:focus:ring-[#30d158]/20'

export default function AuthPage() {
  const t = useT()
  const language = useAppStore((s) => s.language)
  const placeholders = usePlaceholders(language)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate, redirectTo])

  const switchMode = (next: 'login' | 'register') => {
    setMode(next)
    setError(null)
    setInfo(null)
  }

  const onLogin = async (data: LoginForm) => {
    setLoading(true)
    setError(null)
    setInfo(null)
    const { error: authError } = await supabase.auth.signInWithPassword(data)
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  const onRegister = async (data: RegisterForm) => {
    setLoading(true)
    setError(null)
    setInfo(null)
    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName } },
    })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    if (signUpData.session) {
      navigate(redirectTo, { replace: true })
    } else {
      setInfo(t.auth.checkEmail)
      setMode('login')
    }
  }

  if (authLoading || isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-[#f2f2f7] text-sm text-[#8e8e93] dark:bg-black">
        {t.common.loading}
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center bg-[#f2f2f7] px-4 py-10 pb-nav-safe dark:bg-black">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#078930] to-[#0b6e99] text-white shadow-lg shadow-[#078930]/25">
          <span className="text-xl font-bold tracking-tight">BD</span>
        </div>
        <h1 className="ios-large-title text-[#1c1c1e] dark:text-white">
          {mode === 'login' ? t.auth.welcomeBack : t.auth.createAccount}
        </h1>
        <p className="mt-1.5 text-[15px] text-[#8e8e93]">
          {mode === 'login' ? t.auth.signInDesc : t.auth.joinDesc}
        </p>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#1c1c1e]">
        {/* Segmented control */}
        <div className="flex gap-1 border-b border-black/[0.06] p-1.5 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={cn(
              'ios-press flex-1 rounded-xl py-2.5 text-[15px] font-semibold transition',
              mode === 'login'
                ? 'bg-[#078930]/12 text-[#078930] dark:bg-[#30d158]/18 dark:text-[#30d158]'
                : 'text-[#8e8e93]'
            )}
          >
            {t.auth.signIn}
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={cn(
              'ios-press flex-1 rounded-xl py-2.5 text-[15px] font-semibold transition',
              mode === 'register'
                ? 'bg-[#078930]/12 text-[#078930] dark:bg-[#30d158]/18 dark:text-[#30d158]'
                : 'text-[#8e8e93]'
            )}
          >
            {t.auth.register}
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#8e8e93]">{t.auth.email}</label>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={placeholders.email}
                  {...loginForm.register('email')}
                  className={inputClass}
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1.5 text-[13px] text-[#da121a]">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#8e8e93]">{t.auth.password}</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder={placeholders.password}
                  {...loginForm.register('password')}
                  className={inputClass}
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1.5 text-[13px] text-[#da121a]">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && (
                <p className="rounded-xl bg-[#da121a]/10 px-3 py-2.5 text-[14px] text-[#da121a]">{error}</p>
              )}
              {info && (
                <p className="rounded-xl bg-[#078930]/10 px-3 py-2.5 text-[14px] text-[#078930] dark:text-[#30d158]">
                  {info}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="mobile-cta h-12 w-full rounded-full bg-[#078930] text-[16px] font-semibold text-white shadow-md shadow-[#078930]/25 hover:bg-[#056b24]"
              >
                {loading ? t.common.loading : t.auth.signIn}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#8e8e93]">{t.auth.fullName}</label>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder={placeholders.fullName}
                  {...registerForm.register('fullName')}
                  className={inputClass}
                />
                {registerForm.formState.errors.fullName && (
                  <p className="mt-1.5 text-[13px] text-[#da121a]">{registerForm.formState.errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#8e8e93]">{t.auth.email}</label>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={placeholders.email}
                  {...registerForm.register('email')}
                  className={inputClass}
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1.5 text-[13px] text-[#da121a]">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#8e8e93]">{t.auth.password}</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder={placeholders.password}
                  {...registerForm.register('password')}
                  className={inputClass}
                />
                {registerForm.formState.errors.password && (
                  <p className="mt-1.5 text-[13px] text-[#da121a]">{registerForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && (
                <p className="rounded-xl bg-[#da121a]/10 px-3 py-2.5 text-[14px] text-[#da121a]">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="mobile-cta h-12 w-full rounded-full bg-[#078930] text-[16px] font-semibold text-white shadow-md shadow-[#078930]/25 hover:bg-[#056b24]"
              >
                {loading ? t.common.loading : t.auth.register}
              </Button>
            </form>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-[14px] text-[#8e8e93]">
        {mode === 'login' ? (
          <>
            {t.auth.noAccount}{' '}
            <button
              type="button"
              onClick={() => switchMode('register')}
              className="font-semibold text-[#078930] dark:text-[#30d158]"
            >
              {t.auth.register}
            </button>
          </>
        ) : (
          <>
            {t.auth.hasAccount}{' '}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="font-semibold text-[#078930] dark:text-[#30d158]"
            >
              {t.auth.signIn}
            </button>
          </>
        )}
      </p>
    </div>
  )
}
