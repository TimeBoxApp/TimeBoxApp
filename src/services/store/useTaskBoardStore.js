import { create } from 'zustand';

import { PRIORITY_TYPES } from '../../components/Primary/constants';

const DEFAULT_COLUMN_ORDER = ['toDo', 'inProgress', 'done'];

const useTaskBoardStore = create((set) => ({
  boardData: {
    tasks: {
      1: {
        id: '1',
        title: 'Take out the garbage',
        tag: 'university',
        priority: PRIORITY_TYPES.high,
        dueDays: null
      },
      2: {
        id: '2',
        title: 'Watch my favorite show',
        tag: null,
        priority: null,
        dueDays: 2
      },
      3: {
        id: '3',
        title: 'Take vacation',
        tag: 'work',
        priority: PRIORITY_TYPES.low,
        dueDays: null
      }
    },
    columns: {
      toDo: {
        id: 'toDo',
        title: 'To do',
        taskIds: [1]
      },
      inProgress: {
        id: 'inProgress',
        title: 'In progress',
        taskIds: [2]
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: [3]
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

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return state;
      }

      const startColumn = state.boardData.columns[source.droppableId];
      const finishColumn = state.boardData.columns[destination.droppableId];

      if (!startColumn || !finishColumn) {
        console.error('Invalid droppableId or columns not found in boardData.');
        return state;
      }

      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...startColumn,
          taskIds: newTaskIds
        };

        return {
          boardData: {
            ...state.boardData,
            columns: {
              ...state.boardData.columns,
              [newColumn.id]: newColumn
            }
          }
        };
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

        return {
          boardData: {
            ...state.boardData,
            columns: {
              ...state.boardData.columns,
              [newStartColumn.id]: newStartColumn,
              [newFinishColumn.id]: newFinishColumn
            }
          }
        };
      }
    })
}));

export default useTaskBoardStore;
