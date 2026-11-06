// @vitest-environment jsdom
// Akseptansetest F3: resultatskjermen viser ingen tent stjerne ved null stjerner.
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, act } from '@testing-library/react'
import { StarRating } from '../../components/ui.jsx'

describe('StarRating', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })
  it('null stjerner tenner ingen, også etter at tiden går', () => {
    vi.useFakeTimers()
    const { container } = render(<StarRating earned={0} />)
    act(() => vi.advanceTimersByTime(3000))
    const tente = [...container.querySelectorAll('span')].filter((s) => !s.className.includes('opacity-25'))
    expect(tente).toHaveLength(0)
  })
  it('to stjerner tenner to', () => {
    vi.useFakeTimers()
    const { container } = render(<StarRating earned={2} />)
    act(() => vi.advanceTimersByTime(3000))
    const tente = [...container.querySelectorAll('span')].filter((s) => !s.className.includes('opacity-25'))
    expect(tente).toHaveLength(2)
  })
})
