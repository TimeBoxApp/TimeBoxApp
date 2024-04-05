import { apiUrl, checkResponse, getStandardHeaders } from '../../../services/apiUrl';

/**
 * Get calendar events
 * @returns {Promise<Promise>}
 */
export function getCalendarEvents() {
  const url = `${apiUrl()}/calendar/events`;

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    }
  }).then(checkResponse);
}
