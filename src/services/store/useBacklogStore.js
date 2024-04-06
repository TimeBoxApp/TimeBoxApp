import dayjs from 'dayjs';
import { create } from 'zustand';
import { LexoRank } from 'lexorank';

import { updateTask } from '../../pages/Board/services/task';
import { calculateNewRank } from './helpers/task';
const weekOfYear = require('dayjs/plugin/weekOfYear');

dayjs.extend(weekOfYear);

const useBacklogStore = create((set, get) => ({
  isWeekModalOpen: false,
  newTask: {
    title: null,
    description: null,
    status: null,
    priority: null,
    dueDate: null,
    boardRank: null,
    backlogRank: null,
    taskCategories: [],
    weekId: null
  },
  newWeek: {
    name: `Week ${dayjs(new Date()).week()}`,
    startDate: null,
    endDate: null
  },
  backlogData: {
    tasks: {},
    weeks: {}
  },
  isCreateTaskModalOpen: false,
  updateNewTask: (newTaskData) => set((state) => ({ newTask: { ...state.newTask, ...newTaskData } })),
  updateNewWeek: (newWeekData) => set((state) => ({ newWeek: { ...state.newWeek, ...newWeekData } })),
  clearNewTask: () =>
    set({
      newTask: {
        title: null,
        description: null,
        status: null,
        priority: null,
        dueDate: null,
        backlogRank: null,
        categoryId: null,
        weekId: null
      }
    }),
  clearNewWeek: () =>
    set({
      newWeek: {
        name: `Week ${dayjs(new Date()).week()}`,
        startDate: null,
        endDate: null
      }
    }),
  setBacklogData: (newBoardData) => set((state) => ({ backlogData: { ...state.backlogData, ...newBoardData } })),
  setIsCreateTaskModalOpen: (isOpen) => set({ isCreateTaskModalOpen: isOpen }),
  setIsWeekModalOpen: (isOpen) => set({ isWeekModalOpen: isOpen }),
  onDragEnd: (result) => {
    set((state) => {
      const { destination, source, draggableId } = result;

      if (!destination) {
        return state;
      }

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return state;
      }

      const startColumn = state.backlogData.weeks[source.droppableId];
      const finishColumn = state.backlogData.weeks[destination.droppableId];

      if (!startColumn || !finishColumn) {
        console.error('Invalid droppableId or columns not found in backlogData.');
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

        newState.backlogData.weeks[source.droppableId] = newColumn;

        if (newTaskIds.length > 1) {
          const updatedTask = newState.backlogData.tasks[draggableId];
          updatedTask.backlogRank = calculateNewRank(
            newTaskIds,
            destination.index,
            newState.backlogData.tasks,
            LexoRank,
            'backlogRank'
          );

          updateTask(draggableId, {
            weekId: finishColumn.id === 'backlog' ? null : Number(finishColumn.id),
            backlogRank: updatedTask.backlogRank
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

        const updatedTask = newState.backlogData.tasks[draggableId];
        updatedTask.backlogRank = calculateNewRank(
          finishTaskIds,
          destination.index,
          newState.backlogData.tasks,
          LexoRank,
          'backlogRank'
        );

        newState.backlogData.weeks[source.droppableId] = newStartColumn;
        newState.backlogData.weeks[destination.droppableId] = newFinishColumn;

        updateTask(draggableId, {
          weekId: finishColumn.id === 'backlog' ? null : Number(finishColumn.id),
          backlogRank: updatedTask.backlogRank
        });
      }

      return newState;
    });
  },
  assignTaskRank: (columnId) => {
    const state = get();
    const column = state.backlogData.weeks[columnId];

    if (!column) return null;

    const taskIds = column.taskIds;
    const lastTaskId = taskIds[taskIds.length - 1];
    let newRank;

    if (lastTaskId) {
      const lastTaskRank = LexoRank.parse(state.backlogData.tasks[lastTaskId].backlogRank);
      newRank = lastTaskRank.genNext().toString();
    } else {
      // Column is empty, generate a rank at the beginning
      newRank = LexoRank.min().toString();
    }

    return newRank;
  }
}));

export default useBacklogStore;
