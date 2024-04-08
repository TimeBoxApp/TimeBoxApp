import TaskStatusTag from '../../../TaskStatusTag/TaskStatusTag';

import styles from './calendar-task.module.scss';

const CalendarTask = ({ title, status, handleDragStart, taskId }) => {
  return (
    <div
      className={styles.taskContainer}
      draggable="true"
      onDragStart={() => handleDragStart({ title: title, taskId: taskId })}
    >
      <div className={styles.tags}>
        <TaskStatusTag status={status} />
      </div>
      {`${title}`}
    </div>
  );
};

export default CalendarTask;
