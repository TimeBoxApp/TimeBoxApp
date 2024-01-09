import { clearUser } from './user';

/**
 * Return headers standard across the whole application
 */
export function getStandardHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8'
  };
}

/**
 * Return headers ensuring the response will not be cached
 * @returns {{'cache-control': string}}
 */
export function getNoCacheHeaders() {
  return {
    'cache-control': 'no-cache'
  };
}

/**
 * Return API URL with respect to the existing domain
 * @returns {string}
 */
export function apiUrl() {
  return 'http://localhost:3000/api';
}

/**
 * This is a helper function to check response and throw an error on error code below 200 and above 299
 * @param fetchResponse
 * @returns {Promise|Object}
 */
export function checkResponse(fetchResponse) {
  if (fetchResponse.status === 204) return {};

  if (fetchResponse.ok) {
    return fetchResponse
      .clone()
      .json()
      .catch((error) =>
        fetchResponse.text().then((text) => {
          console.error('Failed to parse JSON:', text);

          throw error;
        })
      );
  }

  //
  // If our response is a 401 - redirect and then throw error
  //
  if (fetchResponse.status === 401) {
    setTimeout(() => {
      clearUser();

      // eslint-disable-next-line no-restricted-globals
      location.replace('/login');
    }, 0);
  } else {
    return fetchResponse
      .text()
      .then((responseText) => {
        try {
          return JSON.parse(responseText);
        } catch (err) {
          console.log('Failed to parse JSON:', responseText);
          throw err;
        }
      })
      .then((err) => {
        throw err;
      });
  }
}
