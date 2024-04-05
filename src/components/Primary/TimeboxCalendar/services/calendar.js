import { apiUrl, checkResponse, getStandardHeaders } from '../../../../services/apiUrl';

/**
 * Create new event
 * @returns {Promise<Promise>}
 */
export function createNewEvent(event) {
  const url = `${apiUrl()}/calendar/event`;

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(event)
  }).then(checkResponse);
}

/**
 * Update event
 * @returns {Promise<Promise>}
 */
export function updateEvent(eventId, data) {
  const url = `${apiUrl()}/calendar/event/${eventId}`;

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      ...getStandardHeaders()
    },
    body: JSON.stringify(data)
  }).then(checkResponse);
}
