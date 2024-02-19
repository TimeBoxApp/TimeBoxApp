import Tag from '../Tag/Tag';
import { COLUMN_STATUS_MAPPING } from '../../../services/store/helpers/task';
import { useTranslation } from 'react-i18next';

const TaskStatusTag = ({ status }) => {
  const [t] = useTranslation();

  switch (status) {
    case COLUMN_STATUS_MAPPING.done:
      return <Tag text={t('backlog.status.done')} color={'#0E9F6E'} />;
    case COLUMN_STATUS_MAPPING.inProgress:
      return <Tag text={t('backlog.status.inProgress')} color={'#0ea5e9'} />;
    case COLUMN_STATUS_MAPPING.toDo:
      return <Tag text={t('backlog.status.toDo')} color={'#64748b'} />;
    default:
      return null;
  }
};

export default TaskStatusTag;
