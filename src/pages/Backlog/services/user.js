import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

export function getBacklogData() {
  const url = `${apiUrl()}/users/repository`;

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}
