import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Create user category
 * @returns {Promise<Promise>}
 * @param data
 */
export function createCategory(data) {
  const url = `${apiUrl()}/category`;

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
 * Delete user category
 * @returns {Promise<Promise>}
 * @param categoryId
 */
export function deleteCategory(categoryId) {
  const url = `${apiUrl()}/category/${categoryId}`;

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}
