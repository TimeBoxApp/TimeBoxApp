import { Tag } from 'antd';

import { COLUMN_STATUS_MAPPING } from '../../../services/store/helpers/task';
import { useTranslation } from 'react-i18next';

const TaskStatusTag = ({ status }) => {
  const [t] = useTranslation();

  switch (status) {
    case COLUMN_STATUS_MAPPING.done:
      return (
        <Tag style={{ textTransform: 'uppercase', fontSize: 10 }} color={'green'}>
          {t('backlog.status.done')}
        </Tag>
      );
    case COLUMN_STATUS_MAPPING.inProgress:
      return (
        <Tag style={{ textTransform: 'uppercase', fontSize: 10 }} color={'orange'}>
          {t('backlog.status.inProgress')}
        </Tag>
      );
    case COLUMN_STATUS_MAPPING.toDo:
      return (
        <Tag style={{ textTransform: 'uppercase', fontSize: 10 }} color={'blue'}>
          {t('backlog.status.toDo')}
        </Tag>
      );
    default:
      return null;
  }
};

export default TaskStatusTag;
