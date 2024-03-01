import styles from './MultiSelectInput.module.css';

import { useQuery } from '@apollo/client';
import { ChangeEvent, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { gql } from '../../__generated__';
import { useDropdown } from '../../hooks/useDropdown';
import MultiSelectInputDropdown from './MultiSelectInputDropdown';
import debounce from 'debounce';
import { VscTriangleDown } from 'react-icons/vsc';

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

export default function MultiSelectInput() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { isDropDownOpen, setIsDropDownOpen, parentRef } = useDropdown();
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeItem, setActiveItem] = useState('');

  const { data, loading } = useQuery(GET_ITEMS, {
    variables: { name: searchTerm },
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm || defaultSearchTerm);
  };

  const debouncedHandleInputChange = debounce(handleInputChange, 250); // To avoid sending a request on every keystroke.

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key;
    if (!inputRef.current?.value && key === 'Backspace') {
      const lastItem = selectedItems[selectedItems.length - 1];
      handleItemDeselect(lastItem);
    } else if (activeItem && key === 'Enter') {
      toggleSelectedItem(activeItem);
    } else if (key === 'Escape') {
      setIsDropDownOpen(false);
    } else {
      setIsDropDownOpen(true);
    }
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

  const handleCharacterChange = (name: string) => {
    setActiveItem(name);
  };

  return (
    <div className={styles.wrapper} ref={parentRef}>
      <div className={styles.inputArea}>
        <div className={styles.selectedList}>
          {selectedItems.map((item) => (
            <div className={styles.selectedItem}>
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
          onFocus={() => setIsDropDownOpen(true)}
          onKeyDown={handleInputKeyDown}
        />
        <button
          className={`${styles.expandBtn} ${
            isDropDownOpen ? styles.rotated : ''
          }`}
          onClick={() => setIsDropDownOpen((prev) => !prev)}
        >
          <VscTriangleDown />
        </button>
      </div>
      {isDropDownOpen && (
        <MultiSelectInputDropdown
          data={data}
          loading={loading}
          searchTerm={inputRef.current?.value || ''}
          handleSelect={toggleSelectedItem}
          handleChange={handleCharacterChange}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );
}
