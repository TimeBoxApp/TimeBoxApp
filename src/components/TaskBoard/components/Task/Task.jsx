import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { Draggable } from 'react-beautiful-dnd';

import Tag from '../../../Primary/Tag/Tag';
import Priority from '../../../Primary/Priority/Priority';

import styles from './task.module.scss';

const Task = ({ task, index }) => {
  const [t] = useTranslation();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn(styles.taskContainer, { [styles.isDragging]: snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Tag text={task.tag} />
          <span className={styles.taskTitle}>{task.title}</span>
          <div className={styles.footerContainer}>
            {task.dueDays ? <span className={styles.daysDue}>{`${task.dueDays} ${t('board.daysDue')}`}</span> : null}
            <Priority type={task.priority} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
