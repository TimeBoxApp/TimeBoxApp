import TaskStatusTag from '../../../TaskStatusTag/TaskStatusTag';

import styles from './calendar-task.module.scss';

const CalendarTask = ({ title, status, handleDragStart }) => {
  return (
    <div className={styles.taskContainer} draggable="true" onDragStart={() => handleDragStart({ title: title })}>
      <div className={styles.tags}>
        <TaskStatusTag status={status} />
      </div>
      {`${title}`}
    </div>
  );
};

export default CalendarTask;
