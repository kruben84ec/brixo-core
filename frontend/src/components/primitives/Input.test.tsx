import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/primitives/Input'

// Mock Icon component
vi.mock('@/components/Icon', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <span data-testid={`icon-${name}`} data-size={size} />
  ),
}))

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input name="test" />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input name="email" label="Email" />)
    const label = screen.getByText('Email')
    expect(label).toBeInTheDocument()
  })

  it('associates label with input', () => {
    render(<Input name="email" id="email-input" label="Email" />)
    const label = screen.getByText('Email') as HTMLLabelElement
    expect(label.htmlFor).toBe('email-input')
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your email" />)
    const input = screen.getByPlaceholderText('Enter your email')
    expect(input).toBeInTheDocument()
  })

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" />)
    const error = screen.getByText('This field is required')
    expect(error).toBeInTheDocument()
  })

  it('displays helper text when provided and no error', () => {
    render(<Input helperText="At least 8 characters" />)
    const helper = screen.getByText('At least 8 characters')
    expect(helper).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<Input helperText="Helper" error="Error" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
  })

  it('renders icon when icon prop is provided', () => {
    render(<Input icon="envelope" />)
    const icon = screen.getByTestId('icon-envelope')
    expect(icon).toBeInTheDocument()
  })

  it('handles input changes', async () => {
    const user = userEvent.setup()
    render(<Input name="test" />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'test value')
    expect(input).toHaveValue('test value')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Input ref={ref} name="test" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('applies error class when error is present', () => {
    const { container } = render(<Input error="Error message" />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('error')
  })

  it('applies custom className', () => {
    const { container } = render(<Input className="custom-input" />)
    const wrapper = container.querySelector('div')
    expect(wrapper?.className).toContain('custom-input')
  })

  it('renders with different input types', () => {
    const { container, rerender } = render(<Input type="email" />)
    let input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.type).toBe('email')

    rerender(<Input type="password" />)
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement
    expect(passwordInput).not.toBeNull()
    expect(passwordInput.type).toBe('password')
  })

  it('handles disabled state', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('handles readonly state', () => {
    render(<Input readOnly value="readonly value" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })

  it('forwards all HTML attributes', () => {
    render(
      <Input
        name="test"
        minLength={5}
        maxLength={20}
        required
        aria-label="test input"
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('minlength', '5')
    expect(input).toHaveAttribute('maxlength', '20')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('aria-label', 'test input')
  })
})
