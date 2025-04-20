import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoPageWithResource } from './todo-page'

describe('TodoPage', () => {
  it('초기 화면이 올바르게 렌더링된다', () => {
    // given
    // when
    render(<TodoPageWithResource />)

    // then
    expect(screen.getByText('할 일 목록 / 총 0개')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('할 일을 입력하세요')).toBeInTheDocument()
    expect(screen.getByText('추가')).toBeInTheDocument()
  })

  it('새로운 할 일을 추가할 수 있다', () => {
    // given
    render(<TodoPageWithResource />)
    const input = screen.getByPlaceholderText('할 일을 입력하세요')
    const addButton = screen.getByText('추가')

    // when
    fireEvent.change(input, { target: { value: '새로운 할 일' } })
    fireEvent.click(addButton)

    // then
    expect(input).toHaveValue('')
    expect(screen.getByText('새로운 할 일')).toBeInTheDocument()
  })

  it('할 일을 삭제할 수 있다', () => {
    // given
    render(<TodoPageWithResource />)
    const input = screen.getByPlaceholderText('할 일을 입력하세요')
    fireEvent.change(input, { target: { value: '삭제할 할 일' } })
    fireEvent.click(screen.getByText('추가'))

    // when
    const deleteButton = screen.getByText('삭제')
    fireEvent.click(deleteButton)

    // then
    expect(screen.queryByText('삭제할 할 일')).not.toBeInTheDocument()
  })
})
