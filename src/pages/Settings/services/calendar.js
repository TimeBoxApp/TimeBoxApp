import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Connect Google Calendar
 * @returns {Promise<Promise>}
 */
export async function getGoogleCalendarOAuthLink() {
  const url = `${apiUrl()}/calendar/google`;

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}

/**
 * Disconnect Google Calendar
 * @returns {Promise<Promise>}
 */
export function disconnectGoogleCalendar() {
  const url = `${apiUrl()}/calendar/google`;

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}
