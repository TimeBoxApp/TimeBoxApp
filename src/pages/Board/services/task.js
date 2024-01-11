import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

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
