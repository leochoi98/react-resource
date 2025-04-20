import { generateRender } from '../lib/context'

export type Todo = {
  id: number
  text: string
  completed: boolean
}

export type TodoResource = {
  todos: Todo[]
  addTodo: (text: string) => void
  deleteTodo: (id: number) => void
}

export const TodoRender = generateRender<TodoResource>()
