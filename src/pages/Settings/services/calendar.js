import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Connect Google Account
 * @returns {void}
 */
export function connectGoogleAccount() {
  const url = `${apiUrl()}/auth/google`;

  return window.location.replace(url);
}

/**
 * Disconnect Google Account
 * @returns {Promise<Promise>}
 */
export function disconnectGoogleCalendar() {
  const url = `${apiUrl()}/preferences/google`;

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}
