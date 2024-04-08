import to from 'await-to-js';
import cn from 'classnames';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cloneElement, useMemo, useState } from 'react';
import { Dropdown, Empty, Tag } from 'antd';
import { Droppable } from 'react-beautiful-dnd';

import BacklogTask from '../BacklogTask/BacklogTask';
import useBacklogStore from '../../../../services/store/useBacklogStore';
import { useCurrentWeek } from '../../../../services/store/useCurrentWeekStore';
import { removeWeek, startWeek } from '../../../../pages/Backlog/services/week';
import { error, success } from '../../../../services/alerts';
import { finishWeek } from '../../../../pages/Board/services/week';

import styles from './backlog-column.module.scss';

import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';

const BacklogColumn = ({ week, week: { id, name, startDate, endDate }, tasks, onUpdate }) => {
  const navigate = useNavigate();
  const currentWeek = useCurrentWeek();
  const [t] = useTranslation();
  const { updateNewTask, setIsCreateTaskModalOpen, setIsWeekModalOpen, assignBacklogTaskRank, updateNewWeek } =
    useBacklogStore((state) => ({
      updateNewTask: state.updateNewTask,
      setIsCreateTaskModalOpen: state.setIsCreateTaskModalOpen,
      setIsWeekModalOpen: state.setIsWeekModalOpen,
      updateNewWeek: state.updateNewWeek,
      assignBacklogTaskRank: state.assignTaskRank
    }));
  const [isLoading, setIsLoading] = useState({
    create: false,
    finish: false,
    start: false,
    remove: false
  });
  const start = startDate ? dayjs(startDate).format('DD MMMM') : null;
  const end = endDate ? dayjs(endDate).format('DD MMMM') : null;
  const isCurrentWeek = useMemo(() => currentWeek.id === id, [currentWeek, id]);
  const isBacklog = useMemo(() => id === 'backlog', [id]);

  /**
   * Create a new task and open modal
   */
  const handleCreateTask = () => {
    updateNewTask({
      weekId: Number.parseInt(id),
      status: isCurrentWeek ? 'to-do' : 'created',
      backlogRank: assignBacklogTaskRank(id)
    });
    setIsCreateTaskModalOpen(true);
  };

  const handleStartWeek = async () => {
    setIsLoading({ ...isLoading, start: true });

    const [err] = await to(startWeek(id));

    setIsLoading({ ...isLoading, start: false });

    if (err) return error(t('backlog.weekStartError'));

    success(t('backlog.weekStartSuccess'));

    return navigate('/board');
  };

  /**
   * Week deletion handler
   */
  const handleDeleteWeek = async () => {
    setIsLoading({ ...isLoading, remove: true });

    const [err] = await to(removeWeek(id));

    setIsLoading({ ...isLoading, remove: false });

    if (err) return error(t('backlog.editWeekModal.weekDeleteError'));

    success(t('backlog.editWeekModal.weekDeleteSuccess'));

    return onUpdate();
  };

  /**
   * Week finish handler
   */
  const handleFinishWeek = async () => {
    setIsLoading({ ...isLoading, finish: true });

    const [err] = await to(finishWeek(id));

    setIsLoading({ ...isLoading, finish: false });

    if (err) return error(t('backlog.weekFinishError'));

    success(t('backlog.weekFinishSuccess'));

    return onUpdate();
  };

  const onWeekUpdateModalOpen = () => {
    updateNewWeek(week);

    setIsWeekModalOpen(true);
  };

  const weekDropdownItems = [
    !isBacklog && {
      label: 'Edit week',
      key: '1',
      icon: <EditOutlined />,
      onClick: onWeekUpdateModalOpen
    },
    {
      label: 'Create task',
      key: '5',
      icon: <PlusCircleOutlined />,
      onClick: handleCreateTask
    },
    !isBacklog && {
      label: 'Remove week',
      key: '3',
      icon: <DeleteOutlined />,
      danger: true,
      disabled: isCurrentWeek,
      onClick: handleDeleteWeek
    }
  ];

  const dropdownActionClick = () => {
    if (isBacklog) return setIsWeekModalOpen(true);

    if (isCurrentWeek) return handleFinishWeek();

    if (!currentWeek.id && !isBacklog) return handleStartWeek();

    return handleCreateTask();
  };

  const dropdownActionTitle = useMemo(() => {
    if (isBacklog) return t('backlog.createWeek');

    if (isCurrentWeek) return t('backlog.finishWeek');

    if (!currentWeek.id && !isBacklog) return t('backlog.startWeek');

    return t('backlog.createTask');
  }, [isBacklog, t, isCurrentWeek, currentWeek.id]);

  return (
    <div className={styles.columnContainer}>
      <div className={styles.columnHeader}>
        <div className={styles.header}>
          <div className={styles.name}>
            <span className={styles.columnTitle}>{name}</span>
            {isCurrentWeek ? (
              <Tag bordered={false} color="processing">
                Current
              </Tag>
            ) : null}
          </div>
          <div className={styles.subtitle}>
            {start && end ? (
              <span className={styles.duration}>
                {start} - {end}
              </span>
            ) : null}
            <span className={styles.duration}>({tasks.length} tasks)</span>
          </div>
        </div>

        <Dropdown.Button
          style={{ width: 'auto' }}
          menu={{ items: weekDropdownItems }}
          onClick={dropdownActionClick}
          buttonsRender={([leftButton, rightButton]) => [
            <>{leftButton}</>,
            cloneElement(rightButton, {
              loading: isLoading.remove || (isBacklog && isLoading.create)
            })
          ]}
        >
          {dropdownActionTitle}
        </Dropdown.Button>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <>
            <div
              className={cn(styles.taskList, { [styles.isDraggingOver]: snapshot.isDraggingOver })}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.length ? (
                tasks.map((task, index) => <BacklogTask key={task.id} task={task} index={index} onUpdate={onUpdate} />)
              ) : (
                <Empty
                  className={styles.emptyPlaceholder}
                  imageStyle={{ height: 50 }}
                  style={{ marginBottom: 25 }}
                  description={
                    <span>
                      No tasks here. <br />
                      Create a new one or drag from backlog
                    </span>
                  }
                />
              )}
              {provided.placeholder}
            </div>
          </>
        )}
      </Droppable>
    </div>
  );
};

export default BacklogColumn;
