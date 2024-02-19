import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

export function getBacklogData() {
  const url = `${apiUrl()}/user/backlog`;

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}
