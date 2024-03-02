import cn from 'classnames';
import { Droppable } from 'react-beautiful-dnd';

import Task from '../Task/Task';
import useTaskBoardStore from '../../../../services/store/useTaskBoardStore';
import { userStore } from '../../../../services/store/userStore';
import { COLUMN_STATUS_MAPPING, PREFERENCES_COLUMN_MAPPING } from '../../../../services/store/helpers/task';

import styles from './column.module.scss';
import useBacklogStore from '../../../../services/store/useBacklogStore';

const Column = ({ column, tasks, onUpdate }) => {
  const { user } = userStore();
  const { currentWeek, updateNewTask, setIsCreateTaskModalOpen, assignTaskRank } = useTaskBoardStore((state) => ({
    currentWeek: state.currentWeek,
    setIsCreateTaskModalOpen: state.setIsCreateTaskModalOpen,
    updateNewTask: state.updateNewTask,
    assignTaskRank: state.assignTaskRank
  }));

  /**
   * Create a new task and open modal
   */
  const handleCreateTask = () => {
    updateNewTask({
      weekId: currentWeek.id,
      status: COLUMN_STATUS_MAPPING[column.id],
      userId: user.id,
      boardRank: assignTaskRank(column.id)
    });
    setIsCreateTaskModalOpen(true);
  };

  return (
    <div className={styles.columnContainer}>
      <div className={styles.columnHeader}>
        <h4 className={styles.columnTitle}>
          {user.preferences[PREFERENCES_COLUMN_MAPPING[column.id]] || column.title}
        </h4>
        <button className={styles.addTaskButton} onClick={() => handleCreateTask()}>
          +
        </button>
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
                <Task key={task.id} task={task} index={index} onUpdate={onUpdate} />
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
