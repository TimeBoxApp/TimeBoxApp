import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Get the user's stats
 * @returns {Promise<Promise>}
 */
export function getUserStats() {
  const url = `${apiUrl()}/user/stats`;

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}

/**
 * Update the user's data
 * @param updates
 * @returns {Promise<Promise>}
 */
export function updateUserData(updates) {
  const url = `${apiUrl()}/user`;

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(updates)
  }).then(checkResponse);
}
