import { DragDropContext } from 'react-beautiful-dnd';

import Column from './components/Column/Column';
import useTaskBoardStore from '../../services/store/useTaskBoardStore';

import styles from './task-board.module.scss';

const TaskBoard = () => {
  const { boardData, onDragEnd } = useTaskBoardStore((state) => ({
    boardData: state.boardData,
    onDragEnd: state.onDragEnd
  }));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.taskBoard}>
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
