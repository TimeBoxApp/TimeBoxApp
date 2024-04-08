import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Send a request to create a new user
 * @param firstName
 * @param lastName
 * @param email
 * @param password
 * @returns {Promise<any | never>}
 */
export function signUp({ firstName, lastName, email, password }) {
  const url = `${apiUrl()}/users`;
  const data = {
    firstName,
    lastName,
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
