import { message } from 'antd';

import i18n from './i18n';

export const success = (text) => message.success(text);

export const error = (text) => message.error(text || i18n.t('primary.errors.defaultError'));
