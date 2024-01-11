import { PRIORITY_TYPES } from '../constants';

import styles from './priority.module.scss';

const Priority = ({ type }) => {
  switch (type) {
    case PRIORITY_TYPES.high:
      return <span className={styles.high}>{type}</span>;
    case PRIORITY_TYPES.medium:
      return <span className={styles.medium}>{type}</span>;
    case PRIORITY_TYPES.low:
      return <span className={styles.low}>{type}</span>;
    default:
      return null;
  }
};

export default Priority;
