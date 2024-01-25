import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import Priority from '../../Priority/Priority';
import { PRIORITY_TYPES } from '../../constants';

import styles from './priority-select.module.scss';

const PrioritySelect = ({ onChange, value }) => {
  const [t] = useTranslation();
  const options = [
    {
      value: PRIORITY_TYPES.low,
      label: <Priority size={'m'} type={PRIORITY_TYPES.low} />
    },
    {
      value: PRIORITY_TYPES.medium,
      label: <Priority size={'m'} type={PRIORITY_TYPES.medium} />
    },
    {
      value: PRIORITY_TYPES.high,
      label: <Priority size={'m'} type={PRIORITY_TYPES.high} />
    }
  ];

  /**
   * Renders options
   * @param value
   * @returns {JSX.Element}
   */
  const optionRender = ({ value }) => {
    return (
      <div className={styles.option}>
        <Priority type={value} size={'m'} />
      </div>
    );
  };

  return (
    <Select
      allowClear
      placeholder={t('primary.selects.priorityPlaceholder')}
      optionRender={optionRender}
      optionLabelProp={'label'}
      variant="filled"
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};

export default PrioritySelect;
