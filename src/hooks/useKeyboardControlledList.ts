import { useEffect, useRef, useState } from 'react';

export default function useKeyboardControlledList(arrayLength: number) {
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const activeItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === 'ArrowDown') {
        setActiveItemIndex((prev) => (prev + 1) % arrayLength);
      } else if (key === 'ArrowUp') {
        setActiveItemIndex((prev) => (prev - 1 + arrayLength) % arrayLength);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [arrayLength]);

  useEffect(() => {
    if (!activeItemRef.current) return;

    activeItemRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [activeItemIndex]);

  return { activeItemRef, activeItemIndex };
}
