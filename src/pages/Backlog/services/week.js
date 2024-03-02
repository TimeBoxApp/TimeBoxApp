import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

export function removeWeek(id) {
  const url = `${apiUrl()}/week/${id}`;

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}

export function createWeek(data) {
  const url = `${apiUrl()}/week`;

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(data)
  }).then(checkResponse);
}

export function updateWeek(id, data) {
  const url = `${apiUrl()}/week/${id}`;

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(data)
  }).then(checkResponse);
}
