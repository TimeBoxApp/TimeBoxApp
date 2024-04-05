import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import { COLUMN_STATUS_MAPPING, STATUS_COLUMN_MAPPING } from '../../../services/store/helpers/task';

const TaskStatusTag = ({ status }) => {
  const [t] = useTranslation();

  switch (status) {
    case COLUMN_STATUS_MAPPING.done || STATUS_COLUMN_MAPPING.done:
      return (
        <Tag
          style={{ textTransform: 'uppercase', fontSize: 10, maxWidth: 'fit-content', marginRight: 0 }}
          color={'green'}
        >
          {t('backlog.status.done')}
        </Tag>
      );
    case COLUMN_STATUS_MAPPING.inProgress || STATUS_COLUMN_MAPPING['in-progress']:
      return (
        <Tag
          style={{ textTransform: 'uppercase', fontSize: 10, maxWidth: 'fit-content', marginRight: 0 }}
          color={'orange'}
        >
          {t('backlog.status.inProgress')}
        </Tag>
      );
    case COLUMN_STATUS_MAPPING.toDo || STATUS_COLUMN_MAPPING['to-do']:
      return (
        <Tag
          style={{ textTransform: 'uppercase', fontSize: 10, maxWidth: 'fit-content', marginRight: 0 }}
          color={'blue'}
        >
          {t('backlog.status.toDo')}
        </Tag>
      );
    default:
      return null;
  }
};

export default TaskStatusTag;
