import { useEffect, useRef, useState } from 'react';
import styles from './MultiSelectInputDropdown.module.css';

type Props = {
  items: any[];
};

function MultiSelectInputDropdown({ items }: Props) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const activeItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === 'ArrowDown') {
        setActiveItemIndex((prev) => (prev + 1) % items.length);
      } else if (key === 'ArrowUp') {
        setActiveItemIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [items.length]);

  useEffect(() => {
    if (!activeItemRef.current) return;

    activeItemRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [activeItemIndex]);

  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li
          className={`${styles.listItem} ${
            index === activeItemIndex ? styles.active : ''
          }`}
          key={index}
          ref={index === activeItemIndex ? activeItemRef : null}
        >
          <img
            className={styles.image}
            src="https://cdn.dribbble.com/users/5592443/screenshots/14279501/drbl_pop_r_m_rick_4x.png"
            alt=""
          />
          <div className={styles.listItemDetails}>
            <span className={styles.listItemName}>{item.name}</span>
            <span className={styles.listItemEpisodes}>
              {item.episodes} Episodes
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MultiSelectInputDropdown;
