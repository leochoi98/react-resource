import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pass } from './pass'

describe('Pass', () => {
  it('유효한 React 엘리먼트에 props를 전달한다', () => {
    // given
    const TestComponent = ({ id, className }: { id?: string; className?: string }) => (
      <div id={id} className={className}>
        테스트 컴포넌트
      </div>
    )

    // when
    render(
      <Pass id="test-id" className="test-class">
        <TestComponent />
      </Pass>,
    )

    // then
    const element = screen.getByText('테스트 컴포넌트')
    expect(element).toHaveAttribute('id', 'test-id')
    expect(element).toHaveAttribute('class', 'test-class')
  })
})
