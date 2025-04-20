import { TestComponentWithResource } from './components/render-count-page'
// import { TodoPageWithResource } from './components/todo-page'

export function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Todo List</h1>
        {/* <TodoPageWithResource /> */}
        <TestComponentWithResource />
      </div>
    </div>
  )
}
