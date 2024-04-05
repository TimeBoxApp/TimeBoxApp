import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Send a request to login into a system
 * @param email
 * @param password
 * @returns {Promise<any | never>}
 */
export function login({ email, password }) {
  const url = `${apiUrl()}/auth/login`;
  const data = {
    email,
    password
  };

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
 * Log out current user
 * @returns {Promise<any | never>}
 */
export function logout() {
  const url = `${apiUrl()}/auth/logout`;

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}

/**
 * Get current user data
 */
export function getCurrentUser() {
  let url = `${apiUrl()}/user/me`;
  const headers = {
    ...getStandardHeaders()
  };

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers
  }).then(checkResponse);
}
