import { ComponentType, createContext, ReactNode, RefObject, useContext, useReducer, useRef } from 'react'
import { assert } from './utils'
import { useIsomorphicEffect } from '../hooks/use-isomorphic-effect'

type ResourceCollection<Data extends Record<string, unknown>> = RefObject<{
  data: Data
  listeners: Set<(data: Data) => void>
}>

const ResourceContext = createContext<ResourceCollection<Record<string, unknown>>>(undefined!)

function ResourceProvider<Data extends Record<string, unknown>>({ children, useResource }: { children: React.ReactNode; useResource: () => Data }) {
  const data = useResource()

  const resourceCollection = useRef({
    data,
    listeners: new Set<(data: Data) => void>(),
  })

  const isMounted = useRef(false)

  useIsomorphicEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    resourceCollection.current.data = data
    resourceCollection.current.listeners.forEach((listener) => listener(data))
  }, [data])

  return <ResourceContext.Provider value={resourceCollection as ResourceCollection<Record<string, unknown>>}>{children}</ResourceContext.Provider>
}

// 제너릭이 여러개일때...
// 첫번째 제너릭에만 타입 넣어주면 에러남 ㅎㅎ,,,
// 두번쨰 제너릭에 디폴트값 넣어줘도 진짜 디폴트로 처리됨
export function withResource<Props extends Record<string, unknown>, Resource extends Record<string, unknown>>(
  Component: ComponentType<Props>,
  hook: () => Resource,
) {
  const WithResourceComponent: ComponentType<Props> = (props) => (
    <ResourceProvider useResource={hook}>
      <Component {...props} />
    </ResourceProvider>
  )

  WithResourceComponent.displayName = `withResource(${Component.displayName})`

  return WithResourceComponent
}

function useResource<Data extends Record<string, unknown> = Record<string, unknown>, Selected extends Record<string, unknown> = Data>(
  select: (data: Data) => Selected,
) {
  const resourceCollection = useContext(ResourceContext) as ResourceCollection<Data>

  assert(typeof resourceCollection !== undefined, 'ResourceCollection is not found.')

  const { data, listeners } = resourceCollection.current

  const [state, dispatch] = useReducer((prev) => {
    const selected = select(data)

    // FIXME: object는 매번 새로 생성되니까 다른게 당연함....
    // console.log(prev, selected, prev === selected)

    if (prev !== selected) {
      return selected
    }

    return prev
  }, select(data))

  useIsomorphicEffect(() => {
    listeners.add(dispatch)

    return () => {
      listeners.delete(dispatch)
    }
  }, [listeners])

  return state
}

// 뭔가 여기에 타입하나가 더 있으면 문제가 해결될것같기도한데;;;;
// 역시 고차함수야;;
export function generateRender<Data extends Record<string, unknown>>() {
  return function Renderer<Selected extends Record<string, unknown> = Data>({
    select = (data: Data) => data as unknown as Selected,
    children,
  }: {
    select?: (data: Data) => Selected
    children: (selected: Selected) => ReactNode
  }) {
    const selected = useResource<Data, Selected>(select)

    return children(selected)
  }
}

// // 예시 사용법:
// type UserResource = {
//   name: string
//   age: number
//   email: string
// }

// // 2. 컴포넌트에서 Resource 직접 사용
// type UserPageProps = {
//   title?: string
//   showEmail?: boolean
// }

// const UserRenderer = generateRender<UserResource>()

// function UserPage({ title = '사용자 프로필', showEmail = true }: UserPageProps) {
//   return (
//     <UserRenderer select={(data) => ({ name: data.name, email: `${data.name}@example.com` })}>
//       {(data) => {
//         const newEmail = `${data.name}@example.com`

//         return (
//           <div>
//             <h2>{title}</h2>
//             <h3>{data.name}</h3>
//             {showEmail && <p>{newEmail}</p>}
//           </div>
//         )
//       }}
//     </UserRenderer>
//   )
// }

// // 3. HOC로 리소스 주입
// const UserPageWithResource = withResource(UserPage, function useUserResource(): UserResource {
//   return {
//     name: '김철수',
//     age: 25,
//     email: 'test@example.com',
//   }
// })

// // 사용:
// ;<UserPageWithResource key={1} title="내 프로필" showEmail={false} />
