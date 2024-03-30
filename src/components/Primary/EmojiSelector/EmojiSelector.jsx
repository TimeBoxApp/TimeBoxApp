import { Popover } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import styles from './emoji-selector.module.scss';

const EmojiSelector = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const onClickHandler = (emoji) => {
    onChange({ emoji: emoji.emoji });
    hide();
  };

  return (
    <div className={styles.wrapper}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        content={<EmojiPicker onEmojiClick={(emoji) => onClickHandler(emoji)} />}
        trigger="click"
      >
        <div className={styles.container}>{value ? value : <PlusOutlined style={{ width: 16 }} />}</div>
      </Popover>
    </div>
  );
};

export default EmojiSelector;
