import styles from './MultiSelectInput.module.css';

import { useQuery } from '@apollo/client';
import { ChangeEvent, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { gql } from '../__generated__';
import { useDropdown } from '../hooks/useDropdown';
import MultiSelectInputDropdown from './MultiSelectInputDropdown';
import debounce from 'debounce';

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

  const debouncedHandleInputChange = debounce(handleInputChange, 250); // To avoid sending too much request

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key;
    if (!inputRef.current?.value && key === 'Backspace') {
      const newSelectedItems = selectedItems.slice(0, selectedItems.length - 1);
      setSelectedItems(newSelectedItems);
    } else if (key === 'Enter') {
      if (activeItem) {
        setSelectedItems([...selectedItems, activeItem]);
      }
    }
  };

  const handleItemDeselect = (item: string) => {
    const newSelectedItems = selectedItems.filter(
      (selectedItem) => selectedItem.toLowerCase() !== item.toLowerCase()
    );

    setSelectedItems(newSelectedItems);
  };

  const handleCharacterSelect = (name: string) => {
    const newSelectedItems = [...selectedItems, name];

    setSelectedItems(newSelectedItems);
  };

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
        <button className={styles.expandBtn}></button>
      </div>
      {isDropDownOpen && (
        <MultiSelectInputDropdown
          data={data}
          loading={loading}
          searchTerm={searchTerm}
          handleSelect={handleCharacterSelect}
          handleChange={handleCharacterChange}
        />
      )}
    </div>
  );
}
