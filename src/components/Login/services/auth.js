import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Send a request to login into system
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
