import React, { PropsWithChildren } from 'react'

export function Pass<Props extends Record<string, unknown>>({ children: Children, ...props }: PropsWithChildren<Props>) {
  if (!React.isValidElement(Children)) {
    return null
  }

  return React.cloneElement(Children, {
    ...props,
    __internal__: 'passed',
  } as Record<string, unknown>)
}

// ;<Pass props={{ id: 'test' }}>
//   <div>
//     <p>test</p>
//   </div>
// </Pass>
