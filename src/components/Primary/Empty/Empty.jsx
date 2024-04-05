import { Button, Empty } from 'antd';

import styles from '../../../pages/Board/board.module.scss';

const TimeboxEmpty = ({ text, buttonText, onClick }) => {
  return (
    <div className={styles.empty}>
      <Empty description={<span>{text}</span>} />
      <Button type={'primary'} shape={'round'} size={'small'} onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
};

export default TimeboxEmpty;
