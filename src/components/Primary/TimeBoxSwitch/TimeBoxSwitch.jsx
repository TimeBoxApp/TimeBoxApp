import { Switch } from 'antd';

import styles from './timebox-switch.module.scss';

const TimeBoxSwitch = ({ isLoading, checked, onChange, label }) => {
  return (
    <div className={styles.container}>
      <Switch loading={isLoading} checked={checked} onChange={onChange} />
      <span className={styles.label}>{label}</span>
    </div>
  );
};
export default TimeBoxSwitch;
