import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import styles from './create-category-modal.module.scss';
import SaveButton from '../../../../../../components/Primary/Buttons/SaveButton/SaveButton';
import CancelButton from '../../../../../../components/Primary/Buttons/CancelButton/CancelButton';
import { Modal } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import TextInput from '../../../../../../components/Primary/TextInput/TextInput';

const CreateCategoryModal = ({ isOpen, setIsOpen, category, updateCategory, onCreate }) => {
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const clearNewCategory = () => {
    updateCategory({ title: null, description: null, emoji: null, color: null });
  };

  const onCancelHandler = () => {
    setIsOpen(false);
    clearNewCategory();
  };

  const onCreateHandler = async () => {
    setIsLoading(true);

    await onCreate();

    clearNewCategory();

    setIsLoading(false);

    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      width={800}
      title={<h2>{t('settings.categories.createModal.title')}</h2>}
      // onOk={onCreate}
      onCancel={onCancelHandler}
      wrapClassName={styles.modalContent}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
          padding: '30px 34px'
        }
      }}
      footer={(_) => (
        <div className={styles.footer}>
          <div className={styles.buttons}>
            <CancelButton type="text" onClick={() => onCancelHandler()} />
            <SaveButton
              text={t('board.createTaskModal.createButton')}
              isLoading={isLoading}
              onClick={() => onCreateHandler()}
            />
          </div>
        </div>
      )}
    >
      <div className={styles.modalContent}>
        <TextInput
          onChange={(e) => updateCategory({ title: e.target.value })}
          value={category.title}
          label={t('settings.categories.createModal.categoryTitle')}
          placeholder={t('settings.categories.createModal.categoryTitlePlaceholder')}
        />
        <TextInput
          onChange={(e) => updateCategory({ description: e.target.value })}
          value={category.description}
          label={t('settings.categories.createModal.categoryTitle')}
          placeholder={t('settings.categories.createModal.categoryTitlePlaceholder')}
        />
        <EmojiPicker onEmojiClick={(emoji) => updateCategory({ emoji: emoji.emoji })} />
      </div>
    </Modal>
  );
};

export default CreateCategoryModal;
