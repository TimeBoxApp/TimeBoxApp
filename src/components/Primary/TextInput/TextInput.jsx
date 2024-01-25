import { Input } from 'antd';

import styles from './text-input.module.scss';

const { TextArea } = Input;

const TextInput = ({ placeholder, onChange, label, type, value }) => {
  return (
    <div className={styles.input}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {type === 'textarea' ? (
        <TextArea
          allowClear
          placeholder={placeholder}
          variant="filled"
          onChange={onChange}
          autoSize={{
            minRows: 5,
            maxRows: 8
          }}
          value={value}
        />
      ) : (
        <Input allowClear placeholder={placeholder} variant="filled" onChange={onChange} value={value} />
      )}
    </div>
  );
};

export default TextInput;
