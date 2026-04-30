import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from '@/components/feedback/Card'

describe('Card Component', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders with complex children', () => {
    render(
      <Card>
        <h1>Title</h1>
        <p>Description</p>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    const card = container.querySelector('div')
    expect(card?.className).toContain('custom-card')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Card onClick={handleClick}>Clickable card</Card>)

    const card = screen.getByText('Clickable card')
    await user.click(card)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('renders without onClick handler', () => {
    const { container } = render(<Card>Non-clickable card</Card>)
    const card = container.querySelector('div')
    expect(card).toBeInTheDocument()
  })

  it('combines multiple classNames correctly', () => {
    const { container } = render(<Card className="class-1 class-2">Content</Card>)
    const card = container.querySelector('div')
    expect(card?.className).toContain('class-1')
    expect(card?.className).toContain('class-2')
  })
})
