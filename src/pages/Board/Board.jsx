import to from 'await-to-js';
import dayjs from 'dayjs';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Empty } from 'antd';

import useTaskBoardStore from '../../services/store/useTaskBoardStore';
import TaskBoard from '../../components/TaskBoard/TaskBoard';
import { userStore } from '../../services/store/userStore';
import { getWeekData } from './services/user';
import { PRIORITY_TYPES } from '../../components/Primary/constants';
import { STATUS_COLUMN_MAPPING } from '../../services/store/helpers/task';
import { error } from '../../services/alerts';

import styles from './board.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const Board = () => {
  const { user } = userStore();
  const { setBoardData, setCurrentWeek, currentWeek } = useTaskBoardStore();
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const weekDurationTitle = useMemo(() => {
    const startDate = dayjs(currentWeek.startDate);
    const endDate = dayjs(currentWeek.endDate);
    const sameMonth = startDate.month() === endDate.month();
    const formattedStartDate = startDate.format('D');
    const formattedEndDate = sameMonth ? endDate.format('D') : endDate.format('D MMMM');

    return sameMonth
      ? `${formattedStartDate} - ${formattedEndDate} ${startDate.format('MMMM')}`
      : `${formattedStartDate} ${startDate.format('MMMM')} - ${formattedEndDate}`;
  }, [currentWeek]);

  const convertTasks = (response) => {
    const tasks = {};
    const columns = {
      toDo: {
        id: 'toDo',
        title: 'To do',
        taskIds: []
      },
      inProgress: {
        id: 'inProgress',
        title: 'In progress',
        taskIds: []
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: []
      }
    };

    Object.entries(response.tasks).forEach(([status, taskArray]) => {
      taskArray.forEach((task) => {
        tasks[task.id] = {
          id: task.id.toString(),
          title: task.title,
          categories: task.categories,
          priority: task.priority ? PRIORITY_TYPES[task.priority] : null,
          boardRank: task.boardRank
        };

        const columnId = STATUS_COLUMN_MAPPING[task.status] || null;

        if (columnId) {
          columns[columnId].taskIds.push(task.id);
        }
      });
    });

    return {
      tasks,
      columns
    };
  };

  const getWeekDetails = async () => {
    setIsLoading(true);

    const [err, weekData] = await to(getWeekData());

    if (err) {
      setIsLoading(false);

      return error();
    }

    if (!weekData.name) {
      return setIsLoading(false);
    }

    setCurrentWeek({
      name: weekData.name,
      endDate: weekData.endDate,
      startDate: weekData.startDate
    });
    setBoardData(convertTasks(weekData));
    setIsLoading(false);
  };

  useEffect(() => {
    getWeekDetails();
  }, []);

  return (
    <div className={styles.boardContainer}>
      <Helmet>
        <title>{t('primary.helmet.board')}</title>
      </Helmet>
      <Trans
        i18nKey={'board.subtitle'}
        values={{
          userName: user.firstName
        }}
      />
      {isLoading ? (
        <SkeletonTheme baseColor="#e9edf7" highlightColor="#f4f7fe" borderRadius={'20px'}>
          <div className={styles.boardSkeleton}>
            <Skeleton containerClassName={styles.titleSkeleton} />
            <div className={styles.columnsSkeleton}>
              <Skeleton containerClassName={styles.columnSkeleton} />
              <Skeleton containerClassName={styles.columnSkeleton} height={350} />
              <Skeleton containerClassName={styles.columnSkeleton} height={500} />
            </div>
          </div>
        </SkeletonTheme>
      ) : currentWeek.name ? (
        <div className={styles.boardData}>
          <div>
            <div className={styles.weekTitle}>
              <h2>{currentWeek.name}</h2>
              <h2 className={styles.weekDates}>{weekDurationTitle}</h2>
            </div>
          </div>
          <TaskBoard />
        </div>
      ) : (
        <div className={styles.empty}>
          <Empty description={<span>{t('board.empty')}</span>} />
        </div>
      )}
    </div>
  );
};

export default Board;
