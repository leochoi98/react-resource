import { useEffect } from 'react'

/**
 * 컴포넌트가 마운트될 때 한 번만 실행되는 훅입니다.
 * @param callback 마운트 시 실행할 콜백 함수
 */
export function useOnMount(callback: () => unknown) {
  useEffect(() => {
    callback()
  }, [])
}
