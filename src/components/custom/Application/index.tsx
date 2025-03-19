import {Canvas} from 'components/core/Canvas';
import {Footer} from 'components/core/Footer';
import {Header} from 'components/core/Header';
import {ToastContainer} from 'react-fox-toast';

import styles from './styles.module.css';

export function Application() {
  return (
    <div className={styles.application}>
      <Header />
      <Canvas />
      <Footer />
      <ToastContainer position="bottom-left" />
    </div>
  );
}
