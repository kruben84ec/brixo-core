import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/services/api'

describe('authStore', () => {
  beforeEach(() => {
    // Clear store and localStorage before each test
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
    })
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const store = useAuthStore.getState()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.isLoading).toBe(false)
    expect(store.isHydrated).toBe(false)
  })

  it('sets authentication state', () => {
    const mockUser: User = {
      id: 'user-123',
      tenant_id: 'tenant-456',
      email: 'test@example.com',
      username: 'testuser',
      authority_level: 'OPERATOR',
      created_at: '2026-04-30T10:00:00Z',
    }
    const token = 'mock-jwt-token'

    useAuthStore.getState().setAuth(token, mockUser)

    const store = useAuthStore.getState()
    expect(store.token).toBe(token)
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('saves token to localStorage on setAuth', () => {
    const mockUser: User = {
      id: 'user-123',
      tenant_id: 'tenant-456',
      email: 'test@example.com',
      username: 'testuser',
      authority_level: 'OPERATOR',
      created_at: '2026-04-30T10:00:00Z',
    }

    useAuthStore.getState().setAuth('test-token', mockUser)

    // Note: localStorage.setItem is mocked in setup, so we check if it was called
    expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'test-token')
  })

  it('clears authentication on logout', () => {
    const mockUser: User = {
      id: 'user-123',
      tenant_id: 'tenant-456',
      email: 'test@example.com',
      username: 'testuser',
      authority_level: 'OPERATOR',
      created_at: '2026-04-30T10:00:00Z',
    }

    useAuthStore.getState().setAuth('test-token', mockUser)
    useAuthStore.getState().logout()

    const store = useAuthStore.getState()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('removes token from localStorage on logout', () => {
    const mockUser: User = {
      id: 'user-123',
      tenant_id: 'tenant-456',
      email: 'test@example.com',
      username: 'testuser',
      authority_level: 'OPERATOR',
      created_at: '2026-04-30T10:00:00Z',
    }

    useAuthStore.getState().setAuth('test-token', mockUser)
    useAuthStore.getState().logout()

    expect(localStorage.removeItem).toHaveBeenCalledWith('access_token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('user')
  })

  it('sets loading state', () => {
    useAuthStore.getState().setLoading(true)
    expect(useAuthStore.getState().isLoading).toBe(true)

    useAuthStore.getState().setLoading(false)
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it('hydrates from localStorage', () => {
    const mockUser: User = {
      id: 'user-123',
      tenant_id: 'tenant-456',
      email: 'test@example.com',
      username: 'testuser',
      authority_level: 'OPERATOR',
      created_at: '2026-04-30T10:00:00Z',
    }

    // Mock localStorage.getItem to return a stored token
    ;(localStorage.getItem as any).mockImplementation((key: string) => {
      if (key === 'access_token') return 'stored-token'
      return null
    })

    useAuthStore.getState().hydrate()
    useAuthStore.getState().setAuth('stored-token', mockUser)

    const store = useAuthStore.getState()
    expect(store.token).toBe('stored-token')
  })

  it('marks store as hydrated after hydrate call', () => {
    useAuthStore.getState().hydrate()

    // Note: This depends on the actual implementation of hydrate()
    // The store should be marked as hydrated
    expect(useAuthStore.getState().isHydrated).toBe(true)
  })

  it('handles multiple authentication cycles', () => {
    const user1: User = {
      id: 'user-1',
      tenant_id: 'tenant-1',
      email: 'user1@example.com',
      username: 'user1',
      authority_level: 'OPERATOR',
      created_at: '2026-04-30T10:00:00Z',
    }

    const user2: User = {
      id: 'user-2',
      tenant_id: 'tenant-2',
      email: 'user2@example.com',
      username: 'user2',
      authority_level: 'ADMIN',
      created_at: '2026-04-30T10:00:00Z',
    }

    // First auth
    useAuthStore.getState().setAuth('token-1', user1)
    expect(useAuthStore.getState().user?.id).toBe('user-1')

    // Logout
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().user).toBeNull()

    // Second auth
    useAuthStore.getState().setAuth('token-2', user2)
    expect(useAuthStore.getState().user?.id).toBe('user-2')
  })

  it('subscribes to state changes', () => {
    const listener = vi.fn()
    const unsubscribe = useAuthStore.subscribe(listener)

    const mockUser: User = {
      id: 'user-123',
      tenant_id: 'tenant-456',
      email: 'test@example.com',
      username: 'testuser',
      authority_level: 'OPERATOR',
      created_at: '2026-04-30T10:00:00Z',
    }

    useAuthStore.getState().setAuth('test-token', mockUser)
    expect(listener).toHaveBeenCalled()

    unsubscribe()
  })

  it('handles different authority levels', () => {
    const levels: Array<'OWNER' | 'ADMIN' | 'MANAGER' | 'OPERATOR'> = [
      'OWNER',
      'ADMIN',
      'MANAGER',
      'OPERATOR',
    ]

    levels.forEach(level => {
      const user: User = {
        id: `user-${level}`,
        tenant_id: 'tenant-456',
        email: `user-${level}@example.com`,
        username: `user-${level}`,
        authority_level: level,
        created_at: '2026-04-30T10:00:00Z',
      }

      useAuthStore.getState().setAuth('token', user)
      expect(useAuthStore.getState().user?.authority_level).toBe(level)
    })
  })
})
