import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';

import { useCurrentUser } from '../../../../services/store/useCurrentUserStore';

const DateSelect = ({ onChange, value }) => {
  const currentUser = useCurrentUser();
  const [t] = useTranslation();
  const disabledDate = (current) => {
    return current.isBefore(Date.now());
  };

  return (
    <DatePicker
      value={value ? dayjs(value) : null}
      onChange={(date, _) => {
        onChange(date?.toISOString() || null);
      }}
      allowClear
      placeholder={t('primary.selects.dueDatePlaceholder')}
      disabledDate={disabledDate}
      format={currentUser.dateFormat}
      showToday={false}
    />
  );
};

export default DateSelect;
