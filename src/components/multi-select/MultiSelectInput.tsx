import styles from './MultiSelectInput.module.css';

import { useQuery } from '@apollo/client';
import debounce from 'debounce';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { VscTriangleDown } from 'react-icons/vsc';
import { gql } from '../../__generated__';
import MultiSelectInputDropdown from './MultiSelectInputDropdown';
import { GetFilteredCharactersQuery } from '../../__generated__/graphql';
import useKeyboardControlledDropdown from '../../hooks/useKeyboardControlledDropdown';

const GET_ITEMS = gql(`
query GetFilteredCharacters($name: String!){
  characters(filter: {name: $name}) {
    results {
      id
      name 
      episode {
        id
      }
      image
    }
  }
}

`);

const defaultSearchTerm = '******'; // Because empty string returns result for some reason. We make sure to get no result initially.

export type Character = NonNullable<
  NonNullable<GetFilteredCharactersQuery['characters']>['results']
>[number];

type Props = {
  onChange: (selectedItems: string[]) => void;
};

export default function MultiSelectInput({ onChange }: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const { data, loading, error } = useQuery(GET_ITEMS, {
    variables: { name: searchTerm },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Character[]>([]);
  const {
    isDropdownOpen,
    setIsDropdownOpen,
    parentRef,
    activeItemIndex,
    setActiveItemIndex,
    activeItemRef,
    handleInputPress,
  } = useKeyboardControlledDropdown(items.length);

  useEffect(() => {
    setItems(data?.characters?.results || []);
    setActiveItemIndex(-1);
  }, [data, setActiveItemIndex]);

  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems, onChange]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm || defaultSearchTerm);
  };

  const debouncedHandleInputChange = debounce(handleInputChange, 250); // To avoid sending a request on every keystroke.

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    const onEnter = () => {
      if (activeItemIndex !== -1) {
        toggleSelectedItem(items[activeItemIndex]?.name || '');
      }
    };

    const onBackSpace = () => {
      //When input is empty, backspace removes selected items one by one
      if (inputRef.current?.value === '') {
        const lastItem = selectedItems[selectedItems.length - 1];
        handleItemDeselect(lastItem);
      }
    };

    handleInputPress(event.key, onEnter, onBackSpace);
  };

  function handleItemDeselect(item: string) {
    const newSelectedItems = selectedItems.filter(
      (selectedItem) => selectedItem.toLowerCase() !== item.toLowerCase()
    );

    setSelectedItems(newSelectedItems);
  }

  function toggleSelectedItem(item: string) {
    const isItemAlreadySelected = selectedItems.includes(item);
    if (isItemAlreadySelected) {
      handleItemDeselect(item);
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} ref={parentRef}>
      <div className={styles.inputArea}>
        <div className={styles.selectedList}>
          {selectedItems.map((item, index) => (
            <div key={index} className={styles.selectedItem}>
              <span>{item}</span>
              <button
                onClick={() => handleItemDeselect(item)}
                className={styles.selectedItemBtn}
              >
                <IoCloseOutline />
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Enter a Character Name"
          ref={inputRef}
          className={styles.input}
          onChange={debouncedHandleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleInputKeyDown}
        />
        <button
          className={`${styles.expandBtn} ${
            isDropdownOpen ? styles.rotated : ''
          }`}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <VscTriangleDown />
        </button>
      </div>
      {isDropdownOpen && (
        <MultiSelectInputDropdown
          items={items}
          loading={loading}
          searchTerm={inputRef.current?.value || ''}
          handleSelect={toggleSelectedItem}
          selectedItems={selectedItems}
          activeItemIndex={activeItemIndex}
          activeItemRef={activeItemRef}
        />
      )}
    </div>
  );
}
