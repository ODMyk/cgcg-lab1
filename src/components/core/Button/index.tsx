import React, {ButtonHTMLAttributes} from 'react';

import styles from './styles.module.css';

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & React.PropsWithChildren,
) {
  return <button className={styles.button} {...props}></button>;
}
