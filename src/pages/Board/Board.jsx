import dayjs from 'dayjs';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { Empty, Skeleton } from 'antd';

import useTaskBoardStore from '../../services/store/useTaskBoardStore';
import TaskBoard from '../../components/TaskBoard/TaskBoard';
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import { userStore } from '../../services/store/userStore';
import { getWeekData } from './services/user';
import { PRIORITY_TYPES } from '../../components/Primary/constants';
import { STATUS_COLUMN_MAPPING } from '../../services/store/helpers/task';

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
          title: task.title,
          categories: task.categories,
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

  const getWeekDetails = async () => {
    setIsLoading(true);
    const weekData = await getWeekData();

    if (!weekData.name) {
      return setIsLoading(false);
    }

    setCurrentWeek({
      id: weekData.id,
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
      <Trans
        i18nKey={'board.subtitle'}
        values={{
          userName: user.firstName
        }}
      />
      {isLoading ? (
        <Skeleton className={styles.empty} />
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
      <CreateTaskModal isOpen={isCreateTaskModalOpen} setIsOpen={setIsCreateTaskModalOpen} onCreate={getWeekDetails} />
    </div>
  );
};

export default Board;
