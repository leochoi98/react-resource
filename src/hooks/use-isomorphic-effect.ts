import { useEffect, useLayoutEffect } from 'react'

/**
 * 서버사이드 렌더링 환경에서는 useEffect를,
 * 클라이언트 환경에서는 useLayoutEffect를 사용하는 훅입니다.
 */
export const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
