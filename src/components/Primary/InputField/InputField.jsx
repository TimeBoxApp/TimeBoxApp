import { useField } from 'formik';

import styles from './input-field.module.scss';

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className={styles.textInputContainer}>
      <label className={styles.label} htmlFor={props.id || props.name}>
        {label}
        {props.required ? ' *' : ''}
      </label>
      <input className={styles.textInput} {...field} {...props} />
      {meta.touched && meta.error ? <span className={styles.error}>{meta.error}</span> : null}
    </div>
  );
};

export default TextInput;
