import { useEffect, useRef, useState } from 'react';
import { useDropdown } from './useDropdown';

export default function useKeyboardControlledDropdown(arrayLength: number) {
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const { isDropdownOpen, setIsDropdownOpen, parentRef } = useDropdown();
  const activeItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!activeItemRef.current) return;

    activeItemRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [activeItemIndex]);

  const handleInputPress = (
    key: string,
    onEnter?: () => void,
    onBackspace?: () => void
  ) => {
    switch (key) {
      case 'Escape':
        setIsDropdownOpen(false);
        break;
      case 'ArrowDown':
        setActiveItemIndex((prev) => (prev + 1) % arrayLength);
        break;
      case 'ArrowUp':
        setActiveItemIndex((prev) => (prev - 1 + arrayLength) % arrayLength);
        break;
      case 'Enter': //Enter action is not there by default
        onEnter && onEnter();
        break;
      case 'Backspace': //Backspace action is not there by default
        onBackspace && onBackspace();
        break;
      default:
        setIsDropdownOpen(true);
        break;
    }
  };

  return {
    activeItemIndex,
    setActiveItemIndex,
    handleInputPress,
    isDropdownOpen,
    setIsDropdownOpen,
    parentRef,
    activeItemRef,
  };
}
