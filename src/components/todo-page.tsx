import { useState } from 'react'
import { withResource } from '../lib/context'
import { useOnMount } from '../hooks/use-on-mount'
import { Todo, TodoRender, TodoResource } from './todo-resource'

function TodoInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('')

  const onClickAdd = () => {
    if (text.trim() === '') {
      alert('할 일을 입력해주세요.')
      return
    }

    onAdd(text)
    setText('')
  }

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onClickAdd()
          }
        }}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="할 일을 입력하세요"
      />
      <button onClick={onClickAdd} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        추가
      </button>
    </div>
  )
}

function TodoItem({ todo, onDelete }: { todo: Todo; onDelete: (id: number) => void }) {
  return (
    <li key={todo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)} className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded-md transition-colors">
        삭제
      </button>
    </li>
  )
}

function TodoPage() {
  return (
    <TodoRender select={(data) => ({ ...data, length: data.todos.length })}>
      {({ todos, addTodo, deleteTodo, length }) => (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">할 일 목록 / 총 {length}개</h1>
          <ul className="space-y-2 mb-4">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
            ))}
          </ul>
          <TodoInput onAdd={addTodo} />
        </div>
      )}
    </TodoRender>
  )
}

export const TodoPageWithResource = withResource(TodoPage, function useTodo(): TodoResource {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (text: string) => {
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ])
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  useOnMount(() => {
    console.log('Welcome to Todo Page')
  })

  return {
    todos,
    addTodo,
    deleteTodo,
  }
})
