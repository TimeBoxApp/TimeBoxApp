import to from 'await-to-js';
import dayjs from 'dayjs';
import Skeleton from 'react-loading-skeleton';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button, Empty, Popconfirm } from 'antd';

import useTaskBoardStore from '../../services/store/useTaskBoardStore';
import TaskBoard from '../../components/TaskBoard/TaskBoard';
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import { getWeekData } from './services/user';
import { PRIORITY_TYPES } from '../../components/Primary/constants';
import { STATUS_COLUMN_MAPPING } from '../../services/store/helpers/task';
import { error, success } from '../../services/alerts';
import { getTasksByWeekId } from './services/task';
import { finishWeek } from './services/week';
import { useCurrentUser } from '../../services/store/useCurrentUserStore';
import { useCurrentWeek, useCurrentWeekActions } from '../../services/store/useCurrentWeekStore';

import styles from './board.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const Board = () => {
  const navigate = useNavigate();
  const currentWeek = useCurrentWeek();
  const { firstName } = useCurrentUser();
  const { setCurrentWeek, clearCurrentWeek } = useCurrentWeekActions();
  const { setBoardData, isCreateTaskModalOpen, setIsCreateTaskModalOpen, newTask, updateNewTask, clearNewTask } =
    useTaskBoardStore((state) => ({
      setIsCreateTaskModalOpen: state.setIsCreateTaskModalOpen,
      isCreateTaskModalOpen: state.isCreateTaskModalOpen,
      setBoardData: state.setBoardData,
      newTask: state.newTask,
      updateNewTask: state.updateNewTask,
      clearNewTask: state.clearNewTask
    }));
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState({
    tasks: true,
    week: false,
    finishWeek: false
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
          priority: task.priority ? PRIORITY_TYPES[task.priority] : null,
          dueDate: task.dueDate,
          boardRank: task.boardRank
        };

        const columnId = STATUS_COLUMN_MAPPING[task.status] || null;

        if (columnId) columns[columnId].taskIds.push(task.id);
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
      ...isLoading,
      tasks: true,
      week: true
    });

    const [err, weekData] = await to(getWeekData());

    if (err) {
      setIsLoading({
        ...isLoading,
        tasks: false,
        week: false
      });

      return error();
    }

    if (!weekData.name) {
      clearCurrentWeek();

      return setIsLoading({
        ...isLoading,
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
      ...isLoading,
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
      ...isLoading,
      tasks: true
    });

    const tasks = await getTasksByWeekId(currentWeek.id);

    setBoardData(convertTasks(tasks));
    setIsLoading({
      ...isLoading,
      tasks: false
    });
  };

  const finishWeekHandler = async () => {
    if (!currentWeek.id) return;

    setIsLoading({
      ...isLoading,
      finishWeek: true
    });

    const [err] = await to(finishWeek(currentWeek.id));

    setIsLoading({
      ...isLoading,
      finishWeek: false
    });

    if (err) return error(t('board.week.finishError'));

    success(t('board.week.finishSuccess'));

    return clearCurrentWeek();
  };

  /**
   * Get week details on mount
   */
  useEffect(() => {
    void getWeekDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentWeek?.name && !isLoading.week) {
    return (
      <div className={styles.empty}>
        <Empty description={<span>{t('board.empty')}</span>} />
        <Button type={'primary'} shape={'round'} size={'small'} onClick={() => navigate('/repository')}>
          {t('board.goToRepository')}
        </Button>
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
          userName: firstName
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
          <div className={styles.heading}>
            <div className={styles.weekTitle}>
              <h2>{currentWeek.name}</h2>
              <h2 className={styles.weekDates}>{weekDurationTitle}</h2>
            </div>
            <Popconfirm
              title={t('board.finishWeek')}
              description={<Trans i18nKey="board.finisWeekConfirmMessage" components={{ 1: <br /> }} />}
              onConfirm={finishWeekHandler}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ marginBottom: '5px' }} shape={'round'} loading={isLoading.finishWeek}>
                {t('board.finishWeek')}
              </Button>
            </Popconfirm>
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
          <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            setIsOpen={setIsCreateTaskModalOpen}
            onCreate={reloadTasks}
            newTask={newTask}
            clearNewTask={clearNewTask}
            updateNewTask={updateNewTask}
          />
        </div>
      )}
    </div>
  );
};

export default Board;
