import dayjs from 'dayjs';
import { DatePicker } from 'antd';
// import { useTranslation } from 'react-i18next';
import { userStore } from '../../../../services/store/userStore';

const { RangePicker } = DatePicker;
// import styles from './date-select.module.scss';

const RangeSelect = ({ onChange, startDate, endDate }) => {
  const { user } = userStore();
  // const [t] = useTranslation();
  const disabledDate = (current) => {
    const oneMonthAhead = dayjs().add(1, 'month');

    return current > oneMonthAhead || current <= dayjs().subtract(1, 'day');
  };
  const handleChange = (range) => {
    if (!range) return onChange({ startDate: null, endDate: null });

    const startDate = range[0].format();
    const endDate = range[1].format();

    onChange({ startDate, endDate });
  };

  return (
    <RangePicker
      value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null}
      format={user.dateFormat}
      disabledDate={disabledDate}
      onChange={handleChange}
    />
  );
};

export default RangeSelect;
