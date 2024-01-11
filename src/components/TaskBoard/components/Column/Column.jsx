import cn from 'classnames';
import { Droppable } from 'react-beautiful-dnd';

import Task from '../Task/Task';

import styles from './column.module.scss';

const Column = ({ column, tasks }) => {
  return (
    <div className={styles.columnContainer}>
      <div className={styles.columnHeader}>
        <h4 className={styles.columnTitle}>{column.title}</h4>
        <button className={styles.addTaskButton}>+</button>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <>
            <div
              className={cn(styles.taskList, { [styles.isDraggingOver]: snapshot.isDraggingOver })}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          </>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
