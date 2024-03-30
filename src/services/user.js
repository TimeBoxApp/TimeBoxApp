import { userStore } from './store/userStore';

/**
 * Class which encapsulates the structure of the user
 */
class User {
  constructor(data) {
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.fullName = data.firstName || data.lastName ? `${data.firstName || ''} ${data.lastName || ''}` : '';
    this.initials = data.firstName || data.lastName ? `${data.firstName[0] || ''}${data.lastName[0] || ''}` : '';
    this.id = data.id || 0;
    this.email = data.email || '';
    this.role = data.role || '';
    this.preferences = data.preferences || {};
    this.categories = data.categories || [];
    this.dateFormat = data.dateFormat || 'DD.MM.YYYY';
  }
}

export function setUser(data) {
  userStore.getState().setUser(new User(data));
}

export function clearUser() {
  userStore.getState().clearUser();
}
