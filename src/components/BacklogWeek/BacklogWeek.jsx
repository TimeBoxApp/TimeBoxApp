import { DragDropContext } from 'react-beautiful-dnd';

import WeekColumn from './components/BacklogColumn/BacklogColumn';
import useBacklogStore from '../../services/store/useBacklogStore';

import styles from './backlog-week.module.scss';

const BacklogWeek = ({ onUpdate }) => {
  const { backlogData, onDragEnd } = useBacklogStore((state) => ({
    backlogData: state.backlogData,
    onDragEnd: state.onDragEnd,
    clearNewWeek: state.clearNewWeek,
    updateNewWeek: state.updateNewWeek,
    isWeekModalOpen: state.isWeekModalOpen,
    setIsWeekModalOpen: state.setIsWeekModalOpen,
    newWeek: state.newWeek
  }));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.taskBoard}>
        {Object.values(backlogData.weeks).map((week) => {
          const tasks = week.taskIds.map((taskId) => backlogData.tasks[taskId]);

          return <WeekColumn key={week.id} week={week} tasks={tasks} onUpdate={onUpdate} />;
        })}
      </div>
    </DragDropContext>
  );
};

export default BacklogWeek;
