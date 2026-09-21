import { useEffect, useState, type RefObject } from 'react';

export function useInView(ref: RefObject<Element | null>, enabled = true) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled]);

  return inView;
}
