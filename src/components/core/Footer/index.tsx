import {useSelector} from 'react-redux';
import {positionSelector} from 'store/modules/AppCommon/selectors';

import styles from './styles.module.css';

export function Footer() {
  const position = useSelector(positionSelector);

  return (
    <footer className={styles.container}>
      <div className={styles.mousePositionContainer}>
        {position.x} {position.y}
      </div>
    </footer>
  );
}
