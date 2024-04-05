import TaskStatusTag from '../../../TaskStatusTag/TaskStatusTag';
import Tag from '../../../Tag/Tag';

import styles from './calendar-task.module.scss';

const CalendarTask = ({ title, status, categories, handleDragStart }) => {
  return (
    <div
      className={styles.taskContainer}
      draggable="true"
      key={title}
      onDragStart={() => handleDragStart({ title: title })}
    >
      <div className={styles.tags}>
        <TaskStatusTag status={status} />
        {categories.map((category) => (
          <Tag id={category.id} color={category.color} text={category.title} emoji={category.emoji} />
        ))}
      </div>
      {`${title}`}
    </div>
  );
};

export default CalendarTask;
