import { Character } from './MultiSelectInput';
import styles from './MultiSelectInputDropdown.module.css';

type Props = {
  items: Character[];
  loading: boolean;
  searchTerm: string;
  handleSelect: (name: string) => void;
  selectedItems: string[];
  activeItemIndex: number;
  activeItemRef: React.RefObject<HTMLLIElement>;
};

function MultiSelectInputDropdown({
  items,
  loading,
  searchTerm,
  handleSelect,
  selectedItems,
  activeItemIndex,
  activeItemRef,
}: Props) {
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
              <div className={styles.imageContainer}>
                <img className={styles.image} src={item?.image || ''} />
              </div>
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
