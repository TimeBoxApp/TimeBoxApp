import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Update user preferences
 * @param updates
 * @returns {Promise<Promise>}
 */
export function updateUserPreferences(updates) {
  const url = `${apiUrl()}/preferences`;

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(updates)
  }).then(checkResponse);
}
