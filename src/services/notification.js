import { notification } from 'antd';

export const error = (message) => {
  return notification.error({ message });
};

export const info = (message) => {
  return notification.info({ message });
};
