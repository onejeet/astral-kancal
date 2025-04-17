import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(true);

  const isTouchDevice =
    typeof window !== 'undefined' && typeof navigator !== 'undefined'
      ? 'ontouchstart' in window || navigator.maxTouchPoints > 0
      : false;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return {
    isMobile,
    isTouchDevice,
  };
}
