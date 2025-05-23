export function value<T>(fn: () => T): T
export function value<T, A>(fn: (arg: A) => T, arg: A): T
export function value<T, A>(fn: (arg?: A) => T, arg?: A): T {
  return arg !== undefined ? fn(arg) : fn()
}

// const $hello = value(() => 'hello')
// const $helloWithArg = value((arg) => `hello ${arg}`, 'world')

export function assert(condition: boolean, message: string | Error): asserts condition {
  if (!condition) {
    if (typeof message === 'string') {
      throw new Error(message)
    }

    throw message
  }
}
