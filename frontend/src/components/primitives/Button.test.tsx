import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/primitives/Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    const { container } = render(<Button>Click me</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('primary')
  })

  it('applies different variants', () => {
    const { container: primaryContainer } = render(<Button variant="primary">Primary</Button>)
    const { container: secondaryContainer } = render(<Button variant="secondary">Secondary</Button>)
    const { container: dangerContainer } = render(<Button variant="danger">Danger</Button>)

    expect(primaryContainer.querySelector('button')?.className).toContain('primary')
    expect(secondaryContainer.querySelector('button')?.className).toContain('secondary')
    expect(dangerContainer.querySelector('button')?.className).toContain('danger')
  })

  it('applies different sizes', () => {
    const { container: smContainer } = render(<Button size="sm">Small</Button>)
    const { container: mdContainer } = render(<Button size="md">Medium</Button>)
    const { container: lgContainer } = render(<Button size="lg">Large</Button>)

    expect(smContainer.querySelector('button')?.className).toContain('sm')
    expect(mdContainer.querySelector('button')?.className).toContain('md')
    expect(lgContainer.querySelector('button')?.className).toContain('lg')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('disables button when loading is true', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    const { container } = render(<Button loading>Loading</Button>)
    const spinner = container.querySelector('[aria-hidden="true"]')
    expect(spinner).toBeInTheDocument()
  })

  it('prevents click when loading', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button loading onClick={handleClick}>Loading</Button>)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Ref test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('custom-class')
  })

  it('renders children correctly', () => {
    render(<Button>Click <strong>me</strong></Button>)
    expect(screen.getByText('me')).toBeInTheDocument()
  })
})
