import { Input } from 'antd';

import styles from './text-input.module.scss';

const { TextArea } = Input;

const TextInput = ({ placeholder, onChange, label, type, value, clearable = true, disabled }) => {
  return (
    <div className={styles.input}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {type === 'textarea' ? (
        <TextArea
          allowClear={clearable}
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
        <Input
          placeholder={placeholder}
          disabled={disabled}
          allowClear={clearable}
          variant="filled"
          onChange={onChange}
          value={value}
        />
      )}
    </div>
  );
};

export default TextInput;
