import cn from 'classnames';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Draggable } from 'react-beautiful-dnd';

import Tag from '../../../Primary/Tag/Tag';
import Priority from '../../../Primary/Priority/Priority';
import TaskInfoModal from '../../../TaskInfoModal/TaskInfoModal';

import styles from './task.module.scss';

const Task = ({ task, index }) => {
  const [t] = useTranslation();
  const [isTaskInfoModalOpen, setIsTaskInfoModalOpen] = useState(false);
  const daysLeft = useMemo(() => {
    if (!task.dueDate || !dayjs(task.dueDate).isValid()) return;

    const today = dayjs().startOf('day');
    const targetDate = dayjs(task.dueDate).startOf('day');

    return targetDate.diff(today, 'day');
  }, [task.dueDate]);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn(styles.taskContainer, { [styles.isDragging]: snapshot.isDragging })}
          onClick={() => setIsTaskInfoModalOpen(true)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {task.categories.map((category) => (
            <Tag key={category.id} text={category.title} emoji={category.emoji} color={category.color} />
          ))}
          <span className={styles.taskTitle}>{task.title}</span>
          <div className={styles.footerContainer}>
            {task.dueDate && daysLeft >= 0 ? (
              <span className={styles.daysDue}>{`${daysLeft} ${t('board.daysDue', { count: daysLeft })}`}</span>
            ) : null}
            {task.dueDate && daysLeft < 0 ? (
              <span className={cn(styles.daysDue, styles.overdue)}>{`${Math.abs(daysLeft)} ${t('board.daysOverdue', {
                count: daysLeft
              })}`}</span>
            ) : null}
            <Priority type={task.priority} />
          </div>
          <TaskInfoModal task={task} isOpen={isTaskInfoModalOpen} setIsOpen={setIsTaskInfoModalOpen} />
        </div>
      )}
    </Draggable>
  );
};

export default Task;
