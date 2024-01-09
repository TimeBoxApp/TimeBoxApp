import { Trans } from 'react-i18next';

import TaskBoard from '../../components/TaskBoard/TaskBoard';
import { userStore } from '../../services/store/userStore';

import styles from './board.module.scss';

const Board = () => {
  const { user } = userStore();

  return (
    <div className={styles.boardContainer}>
      <div>
        <Trans
          i18nKey={'board.subtitle'}
          values={{
            userName: user.firstName
          }}
        />
        <div className={styles.weekTitle}>
          <h2>Week 51</h2>
          <h2 className={styles.weekDates}>11 - 17 December</h2>
        </div>
      </div>
      <TaskBoard />
    </div>
  );
};

export default Board;
