import { IoCloseOutline } from 'react-icons/io5';
import styles from './MultiSelectInput.module.css';
// type Props = {
//   onChange?: () => void;
// };

import { useState } from 'react';
import { useDropdown } from '../hooks/useDropdown';
import MultiSelectInputDropdown from './MultiSelectInputDropdown';

type SelectedItem = {
  name: string;
};

const items = [
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
  {
    name: 'Rick',
    episodes: 2,
  },
];

export default function MultiSelectInput() {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([
    // { name: 'Morty Smith' },
    // { name: 'Cool Rick' },
  ]);
  const { isDropDownOpen, setIsDropDownOpen, parentRef } = useDropdown();

  return (
    <div className={styles.wrapper} ref={parentRef}>
      <div className={styles.inputArea}>
        <div className={styles.selectedList}>
          {selectedItems.map((item) => (
            <div className={styles.selectedItem}>
              <span>{item.name}</span>
              <button className={styles.selectedItemBtn}>
                <IoCloseOutline />
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Enter a Character Name"
          className={styles.input}
          onFocus={() => setIsDropDownOpen(true)}
        />
        <button className={styles.expandBtn}></button>
      </div>
      {isDropDownOpen && <MultiSelectInputDropdown items={items} />}
    </div>
  );
}
