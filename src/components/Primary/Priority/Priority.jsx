import cn from 'classnames';

import { PRIORITY_TYPES } from '../constants';

import styles from './priority.module.scss';

const Priority = ({ type, size = 's' }) => {
  if (!Object.values(PRIORITY_TYPES).includes(type)) return null;

  return (
    <span
      className={cn(styles.priority, {
        [styles.isLarge]: size === 'm',
        [styles.isHigh]: type === PRIORITY_TYPES.high,
        [styles.isMedium]: type === PRIORITY_TYPES.medium,
        [styles.isLow]: type === PRIORITY_TYPES.low
      })}
    >
      {type}
    </span>
  );
};

export default Priority;
