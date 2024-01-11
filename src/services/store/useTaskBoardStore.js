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
  onDragEnd: (result) => {
    set((state) => {
      const { destination, source, draggableId } = result;

      if (!destination) {
        return state;
      }

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return state;
      }

      const startColumn = state.boardData.columns[source.droppableId];
      const finishColumn = state.boardData.columns[destination.droppableId];

      if (!startColumn || !finishColumn) {
        console.error('Invalid droppableId or columns not found in boardData.');
        return state;
      }

      let newState = { ...state };

      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...startColumn,
          taskIds: newTaskIds
        };

        newState.boardData.columns[source.droppableId] = newColumn;

        if (newTaskIds.length > 1) {
          const updatedTask = newState.boardData.tasks[draggableId];
          updatedTask.boardRank = calculateNewRank(newTaskIds, destination.index, newState.boardData.tasks, LexoRank);

          updateTask(draggableId, {
            status: COLUMN_STATUS_MAPPING[finishColumn.id],
            boardRank: updatedTask.boardRank
          });
        }
      } else {
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
        updatedTask.boardRank = calculateNewRank(finishTaskIds, destination.index, newState.boardData.tasks, LexoRank);

        newState.boardData.columns[source.droppableId] = newStartColumn;
        newState.boardData.columns[destination.droppableId] = newFinishColumn;

        updateTask(draggableId, {
          status: COLUMN_STATUS_MAPPING[newFinishColumn.id],
          boardRank: updatedTask.boardRank
        });
      }

      return newState;
    });
  }
}));

export default useTaskBoardStore;
