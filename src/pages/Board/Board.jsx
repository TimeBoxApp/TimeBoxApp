import to from 'await-to-js';
import dayjs from 'dayjs';
import Skeleton from 'react-loading-skeleton';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Empty } from 'antd';

import useTaskBoardStore from '../../services/store/useTaskBoardStore';
import TaskBoard from '../../components/TaskBoard/TaskBoard';
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import { userStore } from '../../services/store/userStore';
import { getWeekData } from './services/user';
import { PRIORITY_TYPES } from '../../components/Primary/constants';
import { STATUS_COLUMN_MAPPING } from '../../services/store/helpers/task';
import { error } from '../../services/alerts';
import { getTasksByWeekId } from './services/task';

import styles from './board.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const Board = () => {
  const { user } = userStore();
  const { setBoardData, setCurrentWeek, currentWeek, isCreateTaskModalOpen, setIsCreateTaskModalOpen } =
    useTaskBoardStore((state) => ({
      setIsCreateTaskModalOpen: state.setIsCreateTaskModalOpen,
      isCreateTaskModalOpen: state.isCreateTaskModalOpen,
      setBoardData: state.setBoardData,
      setCurrentWeek: state.setCurrentWeek,
      currentWeek: state.currentWeek
    }));
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState({
    tasks: true,
    week: false
  });
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
        title: t('board.columnNames.toDo'),
        taskIds: []
      },
      inProgress: {
        id: 'inProgress',
        title: t('board.columnNames.inProgress'),
        taskIds: []
      },
      done: {
        id: 'done',
        title: t('board.columnNames.done'),
        taskIds: []
      }
    };

    Object.entries(response.tasks).forEach(([status, taskArray]) => {
      taskArray.forEach((task) => {
        tasks[task.id] = {
          id: task.id.toString(),
          description: task.description,
          title: task.title,
          categories: task.categories,
          categoryId: task.categories[0]?.id || null,
          priority: task.priority ? PRIORITY_TYPES[task.priority] : null,
          dueDate: task.dueDate,
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

  /**
   * Get current week info and tasks
   */
  const getWeekDetails = async () => {
    setIsLoading({
      tasks: true,
      week: true
    });

    const [err, weekData] = await to(getWeekData());

    if (err) {
      setIsLoading({
        tasks: false,
        week: false
      });

      return error();
    }

    if (!weekData.name) {
      setIsLoading({
        tasks: false,
        week: false
      });
    }

    setCurrentWeek({
      id: weekData.id,
      name: weekData.name,
      endDate: weekData.endDate,
      startDate: weekData.startDate
    });
    setBoardData(convertTasks(weekData));
    setIsLoading({
      tasks: false,
      week: false
    });
  };

  /**
   * Re-fetch current week tasks
   * @returns {Promise<void>}
   */
  const reloadTasks = async () => {
    setIsLoading({
      tasks: true,
      week: false
    });

    const tasks = await getTasksByWeekId(currentWeek.id);

    setBoardData(convertTasks(tasks));
    setIsLoading({
      tasks: false,
      week: false
    });
  };

  /**
   * Get week details on mount
   */
  useEffect(() => {
    void getWeekDetails();
  }, []);

  if (!currentWeek?.name && !isLoading.week) {
    return (
      <div className={styles.empty}>
        <Empty description={<span>{t('board.empty')}</span>} />
      </div>
    );
  }

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
      {isLoading.week && isLoading.tasks ? (
        <div className={styles.boardSkeleton}>
          <Skeleton containerClassName={styles.titleSkeleton} />
          <div className={styles.columnsSkeleton}>
            <Skeleton containerClassName={styles.columnSkeleton} />
            <Skeleton containerClassName={styles.columnSkeleton} height={350} />
            <Skeleton containerClassName={styles.columnSkeleton} height={500} />
          </div>
        </div>
      ) : (
        <div className={styles.boardData}>
          <div>
            <div className={styles.weekTitle}>
              <h2>{currentWeek.name}</h2>
              <h2 className={styles.weekDates}>{weekDurationTitle}</h2>
            </div>
          </div>
          {isLoading.tasks ? (
            <div className={styles.columnTasksSkeleton}>
              <Skeleton containerClassName={styles.columnTaskSkeleton} />
              <Skeleton containerClassName={styles.columnTaskSkeleton} height={350} />
              <Skeleton containerClassName={styles.columnTaskSkeleton} height={500} />
            </div>
          ) : (
            <TaskBoard onUpdate={reloadTasks} />
          )}
          <CreateTaskModal isOpen={isCreateTaskModalOpen} setIsOpen={setIsCreateTaskModalOpen} onCreate={reloadTasks} />
        </div>
      )}
    </div>
  );
};

export default Board;
