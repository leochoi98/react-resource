import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { withResource, generateRender } from './context'
import { ComponentType } from 'react'

describe('context', () => {
  describe('withResource', () => {
    it('리소스를 컴포넌트에 주입한다', () => {
      // given
      type TestResource = {
        message: string
      }

      type TestProps = {
        title: string
      }

      const TestRender = generateRender<TestResource>()

      const TestComponent: ComponentType<TestProps> = ({ title }) => {
        return (
          <TestRender>
            {({ message }) => (
              <div>
                <h1>{title}</h1>
                <p>{message}</p>
              </div>
            )}
          </TestRender>
        )
      }

      const TestComponentWithResource = withResource(TestComponent, function useTestResource() {
        return { message: '테스트 메시지' }
      })

      // when
      render(<TestComponentWithResource title="테스트 제목" />)

      // then
      expect(screen.getByText('테스트 제목')).toBeInTheDocument()
      expect(screen.getByText('테스트 메시지')).toBeInTheDocument()
    })
  })
})
