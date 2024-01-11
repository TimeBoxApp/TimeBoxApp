import { create } from 'zustand';
import { LexoRank } from 'lexorank';

import i18n from '../i18n';
import { updateTask } from '../../pages/Board/services/task';
import { calculateNewRank, COLUMN_STATUS_MAPPING } from './helpers/task';

const DEFAULT_COLUMN_ORDER = ['toDo', 'inProgress', 'done'];

const useTaskBoardStore = create((set) => ({
  currentWeek: { name: '', startDate: '', endDate: '' },
  setCurrentWeek: (newWeekData) => set((state) => ({ currentWeek: { ...state.currentWeek, ...newWeekData } })),
  boardData: {
    tasks: {},
    columns: {
      toDo: {
        id: 'toDo',
        title: i18n.t('board.columnNames.toDo'),
        taskIds: []
      },
      inProgress: {
        id: 'inProgress',
        title: i18n.t('board.columnNames.inProgress'),
        taskIds: []
      },
      done: {
        id: 'done',
        title: i18n.t('board.columnNames.done'),
        taskIds: []
      }
    },
    columnOrder: DEFAULT_COLUMN_ORDER
  },
  setBoardData: (newBoardData) => set((state) => ({ boardData: { ...state.boardData, ...newBoardData } })),
  onDragEnd: (result) =>
    set((state) => {
      const { destination, source, draggableId } = result;

      if (!destination) {
        return state;
      }

      // Dropped in the original place
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return state;
      }

      // Start and finish columns
      const startColumn = state.boardData.columns[source.droppableId];
      const finishColumn = state.boardData.columns[destination.droppableId];

      // If either the start or the finish column doesn't exist in state
      if (!startColumn || !finishColumn) {
        console.error('Invalid droppableId or columns not found in boardData.');
        return state;
      }

      let newState = { ...state };

      // Moving tasks within the same column
      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        newState.boardData.columns[source.droppableId] = {
          ...startColumn,
          taskIds: newTaskIds
        };

        // Calculate the new boardRank only if necessary (if the tasks array has more than one item)
        if (newTaskIds.length > 1) {
          const updatedTask = newState.boardData.tasks[draggableId];
          const beforeId = destination.index === 0 ? null : newTaskIds[destination.index - 1];
          const afterId = destination.index === newTaskIds.length - 1 ? null : newTaskIds[destination.index + 1];
          updatedTask.boardRank = calculateNewRank(beforeId, afterId, newState.boardData.tasks, LexoRank);

          // API call to update the task status and rank
          updateTask(draggableId, {
            status: COLUMN_STATUS_MAPPING[finishColumn.id],
            boardRank: updatedTask.boardRank
          });
        }
      } else {
        // Moving tasks from one column to another
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStartColumn = {
          ...startColumn,
          taskIds: startTaskIds
        };

        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = {
          ...finishColumn,
          taskIds: finishTaskIds
        };

        const updatedTask = newState.boardData.tasks[draggableId];
        updatedTask.boardRank = calculateNewRank(
          finishTaskIds[destination.index - 1],
          finishTaskIds[destination.index + 1],
          newState.boardData.tasks,
          LexoRank
        );

        newState.boardData.columns[source.droppableId] = newStartColumn;
        newState.boardData.columns[destination.droppableId] = newFinishColumn;

        updateTask(draggableId, {
          status: COLUMN_STATUS_MAPPING[newFinishColumn.id],
          boardRank: updatedTask.boardRank
        });
      }

      return newState;
    })
}));

export default useTaskBoardStore;
