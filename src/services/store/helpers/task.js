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

export const calculateNewRank = (beforeId, afterId, tasks, LexoRank) => {
  if (!beforeId && !afterId) {
    // first item in the column
    return LexoRank.min().toString();
  } else if (!beforeId) {
    // if it is the first item in the list
    return LexoRank.parse(tasks[afterId].boardRank).genPrev().toString();
  } else if (!afterId) {
    // if it is the last item in the list
    return LexoRank.parse(tasks[beforeId].boardRank).genNext().toString();
  } else {
    // if it is in between two items
    return LexoRank.parse(tasks[beforeId].boardRank).between(LexoRank.parse(tasks[afterId].boardRank)).toString();
  }
};
