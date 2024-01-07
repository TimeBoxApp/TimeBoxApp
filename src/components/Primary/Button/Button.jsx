import cn from 'classnames';
import { Spin } from 'antd';

import styles from './tb-button.module.scss';

const Button = (props) => {
  const { type = 'button', text, onClick, disabled = false, isLoading = false } = props;

  return (
    <button
      disabled={disabled}
      type={type}
      className={cn(styles.button, { [styles.disabled]: disabled })}
      onClick={onClick}
    >
      {isLoading ? <Spin /> : text}
    </button>
  );
};

export default Button;
