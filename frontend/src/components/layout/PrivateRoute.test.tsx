import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PrivateRoute } from '@/components/layout/PrivateRoute'
import { PublicOnlyRoute } from '@/components/layout/PublicOnlyRoute'
import { useAuthStore } from '@/stores/authStore'

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}))

const MockComponent = () => <div>Protected Component</div>
const MockPublicComponent = () => <div>Public Component</div>

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders component when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true } as any)

    render(
      <BrowserRouter>
        <PrivateRoute>
          <MockComponent />
        </PrivateRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Component')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: false } as any)

    render(
      <BrowserRouter>
        <PrivateRoute>
          <MockComponent />
        </PrivateRoute>
      </BrowserRouter>
    )

    expect(screen.queryByText('Protected Component')).not.toBeInTheDocument()
  })

  it('checks authentication state', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true } as any)

    const { rerender } = render(
      <BrowserRouter>
        <PrivateRoute>
          <MockComponent />
        </PrivateRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Component')).toBeInTheDocument()

    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: false } as any)

    rerender(
      <BrowserRouter>
        <PrivateRoute>
          <MockComponent />
        </PrivateRoute>
      </BrowserRouter>
    )

    expect(screen.queryByText('Protected Component')).not.toBeInTheDocument()
  })
})

describe('PublicOnlyRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders public component when not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: false } as any)

    render(
      <BrowserRouter>
        <PublicOnlyRoute>
          <MockPublicComponent />
        </PublicOnlyRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Public Component')).toBeInTheDocument()
  })

  it('redirects when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true } as any)

    render(
      <BrowserRouter>
        <PublicOnlyRoute>
          <MockPublicComponent />
        </PublicOnlyRoute>
      </BrowserRouter>
    )

    expect(screen.queryByText('Public Component')).not.toBeInTheDocument()
  })

  it('respects authentication state changes', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: false } as any)

    const { rerender } = render(
      <BrowserRouter>
        <PublicOnlyRoute>
          <MockPublicComponent />
        </PublicOnlyRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Public Component')).toBeInTheDocument()

    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true } as any)

    rerender(
      <BrowserRouter>
        <PublicOnlyRoute>
          <MockPublicComponent />
        </PublicOnlyRoute>
      </BrowserRouter>
    )

    expect(screen.queryByText('Public Component')).not.toBeInTheDocument()
  })
})
