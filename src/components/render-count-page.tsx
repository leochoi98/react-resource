import { generateRender, withResource } from '../lib/context'
import { useState, useCallback } from 'react'

type TestResource = {
  count1: number
  count2: number
  addCount1: () => void
  addCount2: () => void
}

const TestRender = generateRender<TestResource>()

const Counter1 = ({ count1, addCount1 }: { count1: number; addCount1: () => void }) => {
  console.log('>>> Counter1 렌더링')

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">count1: {count1}</h2>
      <button onClick={addCount1} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        증가
      </button>
    </div>
  )
}

const Counter2 = ({ count2, addCount2 }: { count2: number; addCount2: () => void }) => {
  console.log('>>> Counter2 렌더링')

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">count2: {count2}</h2>
      <button onClick={addCount2} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        증가
      </button>
    </div>
  )
}

const TestComponent = () => {
  return (
    // NOTE
    // hook이 아닌 component를 사용할 경우 dom tree의 깊이가 깊어진다는 단점이 있다.
    // hook을 사용한다면 별도로 컴포넌틑를 꺼내서 써야해서 불편하고...
    // component를 쓴다면 dom tree가 깊어진다는 단점이 있다.
    <div className="flex flex-col gap-4">
      <TestRender select={({ count1, addCount1 }) => ({ count1, addCount1 })}>
        {(data) => <Counter1 count1={data.count1} addCount1={data.addCount1} />}
      </TestRender>
      <TestRender select={({ count2, addCount2 }) => ({ count2, addCount2 })}>
        {({ count2, addCount2 }) => <Counter2 count2={count2} addCount2={addCount2} />}
      </TestRender>
    </div>
  )
}

export const TestComponentWithResource = withResource(TestComponent, function useTestResource(): TestResource {
  // NOTE
  // 생각: 이 부분 atom으로 갈아끼우면 자동으로 렌더링 최적화가 될 것 같다..? 아니다.
  // 아.. reselect를 이용하거나, select를 배열로 받아야할 것 같다.
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)

  const addCount1 = useCallback(() => setCount1((count) => count + 1), [])
  const addCount2 = useCallback(() => setCount2((count) => count + 1), [])

  return {
    count1,
    count2,
    addCount1,
    addCount2,
  }
})
