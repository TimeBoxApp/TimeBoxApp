import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

export function getWeekData() {
  const url = `${apiUrl()}/users/currentWeek`;

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}
