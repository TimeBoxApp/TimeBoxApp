import { Input } from 'antd';

import styles from './text-input.module.scss';

const { TextArea } = Input;

const TextInput = ({ placeholder, onChange, label, type, value, clearable = true, readonly = false, disabled }) => {
  return (
    <div className={styles.input}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {type === 'textarea' ? (
        <TextArea
          allowClear={clearable}
          placeholder={placeholder}
          onChange={onChange}
          autoSize={{
            minRows: 5,
            maxRows: 8
          }}
          value={value}
        />
      ) : (
        <Input placeholder={placeholder} disabled={disabled} allowClear={clearable} onChange={onChange} value={value} />
      )}
    </div>
  );
};

export default TextInput;
