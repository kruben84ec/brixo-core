import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AlertCard } from '@/components/feedback/AlertCard'

// Mock Icon component
vi.mock('@/components/Icon', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <span data-testid={`icon-${name}`} data-size={size} />
  ),
}))

import { vi } from 'vitest'

describe('AlertCard Component', () => {
  it('renders success alert', () => {
    render(<AlertCard variant="success" title="Success" />)
    expect(screen.getByText('Success')).toBeInTheDocument()
  })

  it('renders danger alert', () => {
    render(<AlertCard variant="danger" title="Danger" />)
    expect(screen.getByText('Danger')).toBeInTheDocument()
  })

  it('renders warning alert', () => {
    render(<AlertCard variant="warning" title="Warning" />)
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('renders info alert', () => {
    render(<AlertCard variant="info" title="Information" />)
    expect(screen.getByText('Information')).toBeInTheDocument()
  })

  it('renders with title only', () => {
    render(<AlertCard variant="success" title="Alert title" />)
    expect(screen.getByText('Alert title')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <AlertCard
        variant="success"
        title="Success"
        description="Operation completed"
      />
    )
    expect(screen.getByText('Operation completed')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(
      <AlertCard variant="success" title="Success" />
    )
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('renders action element when provided', () => {
    render(
      <AlertCard
        variant="danger"
        title="Error"
        action={<button>Retry</button>}
      />
    )
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('does not render action when not provided', () => {
    const { container } = render(
      <AlertCard variant="success" title="Success" />
    )
    const actionDiv = container.querySelector('[class*="action"]')
    expect(actionDiv?.children.length || 0).toBe(0)
  })

  it('renders icon for alerts', () => {
    render(<AlertCard variant="success" title="Success" />)
    const icon = screen.getByTestId('icon-alert')
    expect(icon).toBeInTheDocument()
  })

  it('applies correct variant className', () => {
    const { container: successContainer } = render(
      <AlertCard variant="success" title="Success" />
    )
    const { container: dangerContainer } = render(
      <AlertCard variant="danger" title="Danger" />
    )

    const successAlert = successContainer.querySelector('div')
    const dangerAlert = dangerContainer.querySelector('div')

    expect(successAlert?.className).toContain('success')
    expect(dangerAlert?.className).toContain('danger')
  })

  it('renders with all props', () => {
    render(
      <AlertCard
        variant="warning"
        title="Warning Title"
        description="Warning description"
        action={<button>Action</button>}
      />
    )

    expect(screen.getByText('Warning Title')).toBeInTheDocument()
    expect(screen.getByText('Warning description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('handles complex action content', () => {
    const action = (
      <div>
        <button>Confirm</button>
        <button>Cancel</button>
      </div>
    )

    render(
      <AlertCard
        variant="info"
        title="Confirm"
        description="Are you sure?"
        action={action}
      />
    )

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })
})
