import cn from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Draggable } from 'react-beautiful-dnd';

import Tag from '../../../Primary/Tag/Tag';
import Priority from '../../../Primary/Priority/Priority';
import TaskInfoModal from '../../../TaskInfoModal/TaskInfoModal';
import TaskStatusTag from '../../../Primary/TaskStatusTag/TaskStatusTag';

import styles from './backlog-task.module.scss';

const BacklogTask = ({ task, index, onUpdate }) => {
  const [isTaskInfoModalOpen, setIsTaskInfoModalOpen] = useState(false);

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
          <div className={styles.taskContent}>
            <div className={styles.title}>
              <TaskStatusTag key={task.id} status={task.status} />
              <span className={styles.taskTitle}>{task.title}</span>
            </div>
            <div className={styles.tags}>
              {task.taskCategories.map((category) => (
                <Tag key={category.id} text={category.title} emoji={category.emoji} color={category.color} />
              ))}
              <Priority type={task.priority} />
            </div>
          </div>
          <TaskInfoModal
            taskId={task.id}
            isOpen={isTaskInfoModalOpen}
            setIsOpen={setIsTaskInfoModalOpen}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </Draggable>
  );
};

export default BacklogTask;
