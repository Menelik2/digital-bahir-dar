import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useT } from '@/hooks/useT'

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
const registerSchema = loginSchema.extend({ fullName: z.string().min(2) })
type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

export default function AuthPage() {
  const t = useT()
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
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center text-sm text-slate-500">
        {t.common.loading}
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{mode === 'login' ? t.auth.welcomeBack : t.auth.createAccount}</CardTitle>
          <CardDescription>
            {mode === 'login' ? t.auth.signInDesc : t.auth.joinDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.auth.email}</label>
                <input
                  type="email"
                  autoComplete="email"
                  {...loginForm.register('email')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.auth.password}</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  {...loginForm.register('password')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-500">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {info && <p className="text-sm text-emerald-600">{info}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.common.loading : t.auth.signIn}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.auth.fullName}</label>
                <input
                  type="text"
                  autoComplete="name"
                  {...registerForm.register('fullName')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
                />
                {registerForm.formState.errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{registerForm.formState.errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.auth.email}</label>
                <input
                  type="email"
                  autoComplete="email"
                  {...registerForm.register('email')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.auth.password}</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  {...registerForm.register('password')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
                />
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-500">{registerForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.common.loading : t.auth.register}
              </Button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === 'login' ? (
              <>
                {t.auth.noAccount}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-medium text-sky-600 hover:underline"
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
                  className="font-medium text-sky-600 hover:underline"
                >
                  {t.auth.signIn}
                </button>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
