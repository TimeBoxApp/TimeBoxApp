import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';

import { useCurrentUserPreferences } from '../../../../services/store/useCurrentUserStore';

import styles from './date-select.module.scss';

const DateSelect = ({ onChange, value }) => {
  const preferences = useCurrentUserPreferences();
  const [t] = useTranslation();
  const disabledDate = (current) => {
    return current.isBefore(Date.now());
  };

  return (
    <DatePicker
      value={value ? dayjs(value) : null}
      className={styles.datePicker}
      onChange={(date, _) => {
        onChange(date?.toISOString() || null);
      }}
      allowClear
      placeholder={t('primary.selects.dueDatePlaceholder')}
      disabledDate={disabledDate}
      format={preferences.dateFormat}
      showToday={false}
    />
  );
};

export default DateSelect;
