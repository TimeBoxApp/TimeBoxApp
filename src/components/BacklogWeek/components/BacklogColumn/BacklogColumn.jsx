import cn from 'classnames';
import dayjs from 'dayjs';
import { cloneElement, useMemo, useState } from 'react';
import { Dropdown, Empty, Tag } from 'antd';
import { Droppable } from 'react-beautiful-dnd';

import BacklogTask from '../BacklogTask/BacklogTask';
import useBacklogStore from '../../../../services/store/useBacklogStore';
import useTaskBoardStore from '../../../../services/store/useTaskBoardStore';
import { userStore } from '../../../../services/store/userStore';
import { createWeek, removeWeek } from '../../../../pages/Backlog/services/week';

import styles from './backlog-column.module.scss';

import { CalendarOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';

const BacklogColumn = ({ week, week: { id, name, status, startDate, endDate }, tasks, onUpdate }) => {
  const { user } = userStore();
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
    remove: false
  });
  const start = startDate ? dayjs(startDate).format('DD MMMM') : null;
  const end = endDate ? dayjs(endDate).format('DD MMMM') : null;
  const isCurrentWeek = useMemo(() => status === 'in-progress', [status]);
  const isBacklog = useMemo(() => id === 'backlog', [id]);

  /**
   * Create a new task and open modal
   */
  const handleCreateTask = () => {
    updateNewTask({
      weekId: Number.parseInt(id),
      status: isCurrentWeek ? 'to-do' : 'created',
      userId: user.id,
      backlogRank: assignBacklogTaskRank(id)
    });
    setIsCreateTaskModalOpen(true);
  };

  /**
   * Create a new task and open modal
   */
  const handleDeleteWeek = async () => {
    setIsLoading({ ...isLoading, remove: true });
    await removeWeek(id);

    setIsLoading({ ...isLoading, remove: false });

    return onUpdate();
  };

  /**
   * Create new week and refetch data
   */
  const handleCreateWeek = async () => {
    setIsLoading({ ...isLoading, create: true });
    await createWeek();

    setIsLoading({ ...isLoading, create: false });

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
    isBacklog && {
      label: 'Create week',
      key: '5',
      icon: <PlusCircleOutlined />,
      disabled: !isBacklog,
      onClick: () => setIsWeekModalOpen(true)
    },
    {
      label: 'Set as current',
      key: '2',
      icon: <CalendarOutlined />,
      disabled: true,
      onClick: () => setIsCreateTaskModalOpen(true)
    },
    {
      label: 'Remove week',
      key: '3',
      icon: <DeleteOutlined />,
      danger: true,
      disabled: isCurrentWeek || isBacklog,
      onClick: handleDeleteWeek
    }
  ];

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
          onClick={handleCreateTask}
          buttonsRender={([leftButton, rightButton]) => [
            <>{leftButton}</>,
            cloneElement(rightButton, {
              loading: isLoading.remove || (isBacklog && isLoading.create)
            })
          ]}
        >
          Create new task
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
