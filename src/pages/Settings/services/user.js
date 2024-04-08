import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Get the user's stats
 * @returns {Promise<Promise>}
 */
export function getUserStats() {
  const url = `${apiUrl()}/users/stats`;

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
 * @param userId
 * @param updates
 * @returns {Promise<Promise>}
 */
export function updateUserData(userId, updates) {
  const url = `${apiUrl()}/users/${userId}`;

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(updates)
  }).then(checkResponse);
}
