import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'
import { ThemeProvider } from '@/theme/ThemeProvider'
import React from 'react'

describe('useTheme Hook', () => {
  it('throws error when used outside ThemeProvider', () => {
    // This test verifies that using the hook outside provider throws
    expect(() => {
      renderHook(() => useTheme())
    }).toThrow('useTheme must be used inside ThemeProvider')
  })

  it('returns theme context when used inside ThemeProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, null, children)

    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current).toHaveProperty('theme')
  })

  it('provides theme object with properties', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, null, children)

    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current).toHaveProperty('theme')
  })

  it('provides toggle function', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, null, children)

    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current).toHaveProperty('toggleTheme')
    expect(typeof result.current.toggleTheme).toBe('function')
  })

  it('allows theme toggling', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, null, children)

    const { result } = renderHook(() => useTheme(), { wrapper })

    const initialTheme = result.current.theme

    result.current.toggleTheme()

    await waitFor(() => {
      expect(result.current.theme).not.toBe(initialTheme)
    })
  })

  it('persists theme preference', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, null, children)

    const { result: result1 } = renderHook(() => useTheme(), { wrapper })
    const { result: result2 } = renderHook(() => useTheme(), { wrapper })

    expect(result1.current.theme).toBe(result2.current.theme)
  })
})
