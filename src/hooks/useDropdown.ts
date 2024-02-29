import { useEffect, useRef, useState } from 'react';

export function useDropdown() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { isDropDownOpen, setIsDropDownOpen, parentRef };
}
