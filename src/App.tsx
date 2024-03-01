import MultiSelectInput from './components/multi-select/MultiSelectInput';
import styles from './App.module.css';
import { useState } from 'react';

function App() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleInputChange = (selectedItems: string[]) => {
    setSelectedItems(selectedItems);
  };

  return (
    <main className={styles.mainContainer}>
      <p className={styles.items}>{selectedItems.toString()}</p>
      <MultiSelectInput onChange={handleInputChange} />
    </main>
  );
}

export default App;
