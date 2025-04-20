import { ComponentType, createContext, ReactNode, useContext } from 'react'

const ResourceContext = createContext<Record<string, unknown>>(undefined!)

function ResourceProvider<T extends Record<string, unknown>>({ children, hook }: { children: React.ReactNode; hook: () => T }) {
  return <ResourceContext.Provider value={hook()}>{children}</ResourceContext.Provider>
}

// 제너릭이 여러개일때...
// 첫번째 제너릭에만 타입 넣어주면 에러남 ㅎㅎ,,,
// 두번쨰 제너릭에 디폴트값 넣어줘도 진짜 디폴트로 처리됨
export function withResource<Props extends Record<string, unknown>, T extends Record<string, unknown>>(Component: ComponentType<Props>, hook: () => T) {
  const WithResourceComponent: ComponentType<Props> = (props) => (
    <ResourceProvider hook={hook}>
      <Component {...props} />
    </ResourceProvider>
  )

  WithResourceComponent.displayName = `withResource(${Component.displayName})`

  return WithResourceComponent
}

function useResource<T extends Record<string, unknown> = Record<string, unknown>>() {
  const value = useContext(ResourceContext)

  if (!value) {
    throw new Error('Resource is not found.')
  }

  return value as T
}

// 뭔가 여기에 타입하나가 더 있으면 문제가 해결될것같기도한데;;;;
export function Resource<T extends Record<string, unknown>>({
  children,
}: // select = (data: T) => data as unknown as S,
{
  children: (selected: T) => ReactNode
  //   select?: (data: T) => S
}) {
  const data = useResource<T>()

  return children(data)
}

// 예시 사용법:

// type User = {
//   name: string
//   age: number
//   email: string
// }

// // 1. 리소스 훅 정의
// function useUser(): User {
//   return {
//     name: '김철수',
//     age: 25,
//     email: 'test@example.com',
//   }
// }

// // 2. 컴포넌트에서 Resource 직접 사용
// type UserProfileProps = {
//   title?: string
//   showEmail?: boolean
// }

// function UserProfile({ title = '사용자 프로필', showEmail = true }: UserProfileProps) {
//   return (
//     <Resource<User>>
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
//     </Resource>
//   )
// }

// // 3. HOC로 리소스 주입
// const UserProfileWithResource = withResource(UserProfile, useUser)

// // 사용:
// ;<UserProfileWithResource key={1} title="내 프로필" showEmail={false} />
