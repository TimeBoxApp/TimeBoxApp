import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

export const finishWeek = (weekId) => {
  const url = `${apiUrl()}/week/${weekId}/finish`;

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
};
