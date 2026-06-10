import { useEffect, useRef } from "react";

export function useOutsideClick(
  handler: () => void,
  listenCapturing: boolean = true
) {
  const ref = useRef<any | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing); // true to handle d event in the capturing phrase
  }, [handler, listenCapturing]);

  return ref;
}
