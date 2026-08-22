import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
const registerSchema = loginSchema.extend({ fullName: z.string().min(2) })
type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onLogin = async (data: LoginForm) => {
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) setError(error.message)
    setLoading(false)
  }
  const onRegister = async (data: RegisterForm) => {
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { full_name: data.fullName } } })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{mode === 'login' ? 'Welcome back' : 'Create account'}</CardTitle>
          <CardDescription>{mode === 'login' ? 'Sign in to Digital Bahir Dar' : 'Join to save places and plan trips'}</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div><label className="mb-1.5 block text-sm font-medium">Email</label><input type="email" {...loginForm.register('email')} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900" />{loginForm.formState.errors.email && <p className="mt-1 text-xs text-red-500">{loginForm.formState.errors.email.message}</p>}</div>
              <div><label className="mb-1.5 block text-sm font-medium">Password</label><input type="password" {...loginForm.register('password')} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900" /></div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Log in'}</Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div><label className="mb-1.5 block text-sm font-medium">Full name</label><input type="text" {...registerForm.register('fullName')} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900" /></div>
              <div><label className="mb-1.5 block text-sm font-medium">Email</label><input type="email" {...registerForm.register('email')} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900" /></div>
              <div><label className="mb-1.5 block text-sm font-medium">Password</label><input type="password" {...registerForm.register('password')} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900" /></div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === 'login' ? <>No account? <button type="button" onClick={() => setMode('register')} className="font-medium text-sky-600 hover:underline">Register</button></> : <>Have an account? <button type="button" onClick={() => setMode('login')} className="font-medium text-sky-600 hover:underline">Log in</button></>}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
