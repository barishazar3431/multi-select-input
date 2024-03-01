import { useEffect, useMemo } from 'react';
import { GetFilteredCharactersQuery } from '../../__generated__/graphql';
import useKeyboardControlledList from '../../hooks/useKeyboardControlledList';
import styles from './MultiSelectInputDropdown.module.css';

type Props = {
  data: GetFilteredCharactersQuery | undefined;
  loading: boolean;
  searchTerm: string;
  handleSelect: (name: string) => void;
  handleChange: (name: string) => void;
  selectedItems: string[];
};


function MultiSelectInputDropdown({
  data,
  loading,
  searchTerm,
  handleSelect,
  handleChange,
  selectedItems,
}: Props) {
  const items = useMemo(() => data?.characters?.results || [], [data]);
  const { activeItemIndex, activeItemRef } = useKeyboardControlledList(
    items.length
  );

  useEffect(() => {
    if (activeItemIndex == -1) return;

    handleChange(items[activeItemIndex]?.name || '');
  }, [activeItemIndex, handleChange, items]);

  const returnItemNameJSX = (fullName: string) => {
    if (!fullName) return;

    searchTerm = searchTerm.trim();
    const boldStartIndex = fullName
      .toLowerCase()
      .indexOf(searchTerm.toLowerCase());

    const boldPart = fullName.substring(
      boldStartIndex,
      boldStartIndex + searchTerm.length
    );
    const beforeBoldPart = fullName.substring(0, boldStartIndex);
    const afterBoldPart = fullName.substring(
      boldStartIndex + searchTerm.length
    );

    return (
      <p className={styles.listItemName}>
        <span>{beforeBoldPart}</span>
        <span className={styles.bold}>{boldPart}</span>
        <span>{afterBoldPart}</span>
      </p>
    );
  };

  return (
    <div className={styles.wrapper}>
      {loading && <p className={styles.notification}>Loading...</p>}
      {items.length === 0 && !loading && (
        <p className={styles.notification}>No results found for this query.</p>
      )}
      {items.length > 0 && (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li
              className={`${styles.listItem} ${
                index === activeItemIndex ? styles.active : ''
              }`}
              key={index}
              ref={index === activeItemIndex ? activeItemRef : null}
              onClick={() => handleSelect(item?.name || '')}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item?.name || '')}
                readOnly
              />
              <img
                className={styles.image}
                src={item?.image || ''}
                alt="Rick and Morty Avatar"
              />
              <div className={styles.listItemDetails}>
                {returnItemNameJSX(item?.name || '')}
                <span className={styles.listItemEpisodes}>
                  {item?.episode.length} Episodes
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MultiSelectInputDropdown;
