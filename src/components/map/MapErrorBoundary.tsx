import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type Props = { children: ReactNode; fallbackTitle?: string }
type State = { error: Error | null }

/** Catches map render crashes so the app does not go fully blank */
export class MapErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[MapErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 bg-slate-100 px-4 text-center dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {this.props.fallbackTitle ?? 'Map had a problem'}
          </p>
          <p className="max-w-sm text-sm text-slate-500">
            {this.state.error.message || 'Unknown error'}
          </p>
          <Button
            size="sm"
            onClick={() => {
              this.setState({ error: null })
              window.location.assign('/map')
            }}
          >
            Reload map
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
