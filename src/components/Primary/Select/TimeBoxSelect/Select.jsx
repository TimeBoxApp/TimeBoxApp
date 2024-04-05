import { Select } from 'antd';

import styles from './timebox-select.module.scss';

const TimeBoxSelect = ({ onChange, value, options, clearable, label, placeholder, optionLabelProp }) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <Select
        allowClear={clearable}
        placeholder={placeholder}
        optionLabelProp={optionLabelProp}
        options={options}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default TimeBoxSelect;
