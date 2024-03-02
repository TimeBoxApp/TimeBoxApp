export const COLUMN_STATUS_MAPPING = {
  toDo: 'to-do',
  inProgress: 'in-progress',
  done: 'done'
};

export const STATUS_COLUMN_MAPPING = {
  'to-do': 'toDo',
  'in-progress': 'inProgress',
  done: 'done'
};

export const PREFERENCES_COLUMN_MAPPING = {
  toDo: 'toDoColumnName',
  inProgress: 'inProgressColumnName',
  done: 'doneColumnName'
};

export const calculateNewRank = (taskIds, destinationIndex, tasks, LexoRank, property = 'boardRank') => {
  const beforeId = destinationIndex > 0 ? taskIds[destinationIndex - 1] : null;
  const afterId = destinationIndex < taskIds.length - 1 ? taskIds[destinationIndex + 1] : null;

  if (!beforeId && !afterId) {
    // First item in the column
    return LexoRank.min().toString();
  } else if (!beforeId) {
    // Inserting at the top of the column
    const afterRank = LexoRank.parse(tasks[afterId][property]);
    let newRank = afterRank.genPrev();
    if (newRank.equals(afterRank)) {
      // If getPrev() returns the same rank, switch to a new bucket or force a recalibration
      newRank = newRank.inPrevBucket();
    }
    return newRank.toString();
  } else if (!afterId) {
    // Inserting at the bottom of the column
    const beforeRank = LexoRank.parse(tasks[beforeId][property]);
    return beforeRank.genNext().toString();
  } else {
    // Inserting between two tasks
    const beforeRank = LexoRank.parse(tasks[beforeId][property]);
    const afterRank = LexoRank.parse(tasks[afterId][property]);
    return beforeRank.between(afterRank).toString();
  }
};
