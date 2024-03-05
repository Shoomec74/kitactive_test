import { FC } from 'react';
import styles from './AppHeader.module.less';

const AppHeader: FC = () => {
  const onButtonClick = () => {
    console.log('hello');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}></div>
      <button className={styles.button} onClick={onButtonClick}>
        Выйти
      </button>
    </header>
  );
};

export default AppHeader;
