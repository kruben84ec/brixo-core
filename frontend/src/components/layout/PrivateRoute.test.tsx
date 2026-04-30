import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PrivateRoute } from '@/components/layout/PrivateRoute'
import { PublicOnlyRoute } from '@/components/layout/PublicOnlyRoute'
import React from 'react'

// Mock the auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}))

const { useAuthStore } = require('@/stores/authStore')

const mockComponent = () => <div>Protected Component</div>
const mockPublicComponent = () => <div>Public Component</div>

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders component when authenticated', () => {
    useAuthStore.mockReturnValue(true)

    render(
      <BrowserRouter>
        <PrivateRoute
          element={React.createElement(mockComponent)}
          isAuthenticated={true}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Component')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    useAuthStore.mockReturnValue(false)

    const { container } = render(
      <BrowserRouter>
        <PrivateRoute
          element={React.createElement(mockComponent)}
          isAuthenticated={false}
        />
      </BrowserRouter>
    )

    // Should not render the protected component
    expect(screen.queryByText('Protected Component')).not.toBeInTheDocument()
  })

  it('checks authentication state', () => {
    useAuthStore.mockReturnValue(true)

    const { rerender } = render(
      <BrowserRouter>
        <PrivateRoute
          element={React.createElement(mockComponent)}
          isAuthenticated={true}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Component')).toBeInTheDocument()

    rerender(
      <BrowserRouter>
        <PrivateRoute
          element={React.createElement(mockComponent)}
          isAuthenticated={false}
        />
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
    useAuthStore.mockReturnValue(false)

    render(
      <BrowserRouter>
        <PublicOnlyRoute
          element={React.createElement(mockPublicComponent)}
          isAuthenticated={false}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Public Component')).toBeInTheDocument()
  })

  it('redirects when authenticated', () => {
    useAuthStore.mockReturnValue(true)

    const { container } = render(
      <BrowserRouter>
        <PublicOnlyRoute
          element={React.createElement(mockPublicComponent)}
          isAuthenticated={true}
        />
      </BrowserRouter>
    )

    // Should not render the public component
    expect(screen.queryByText('Public Component')).not.toBeInTheDocument()
  })

  it('respects authentication state changes', () => {
    useAuthStore.mockReturnValue(false)

    const { rerender } = render(
      <BrowserRouter>
        <PublicOnlyRoute
          element={React.createElement(mockPublicComponent)}
          isAuthenticated={false}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Public Component')).toBeInTheDocument()

    rerender(
      <BrowserRouter>
        <PublicOnlyRoute
          element={React.createElement(mockPublicComponent)}
          isAuthenticated={true}
        />
      </BrowserRouter>
    )

    expect(screen.queryByText('Public Component')).not.toBeInTheDocument()
  })
})
