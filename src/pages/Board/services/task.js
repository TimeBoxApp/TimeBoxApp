import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Update task handler
 * @param taskId
 * @param updates
 * @returns {Promise<Promise>}
 */
export function updateTask(taskId, updates) {
  const url = `${apiUrl()}/task/${taskId}`;

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(updates)
  }).then(checkResponse);
}

/**
 * Create task handler
 * @param data
 * @returns {Promise<Promise>}
 */
export function createTask(data) {
  const url = `${apiUrl()}/task`;

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(data)
  }).then(checkResponse);
}

/**
 * Delete task handler
 * @param taskId
 * @returns {Promise<Promise>}
 */
export function deleteTask(taskId) {
  const url = `${apiUrl()}/task/${taskId}`;

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}

/**
 * Get task by id handler
 * @param taskId
 * @returns {Promise<Promise>}
 */
export function getTask(taskId) {
  const url = `${apiUrl()}/task/${taskId}`;

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}

/**
 * Get tasks by week id handler
 * @param weekId
 * @returns {Promise<Promise>}
 */
export function getTasksByWeekId(weekId) {
  const url = `${apiUrl()}/task?weekId=${weekId}`;

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}
