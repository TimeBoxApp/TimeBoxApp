import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Modal } from 'antd';

import SaveButton from '../../../../../../components/Primary/Buttons/SaveButton/SaveButton';
import CancelButton from '../../../../../../components/Primary/Buttons/CancelButton/CancelButton';
import TextInput from '../../../../../../components/Primary/TextInput/TextInput';
import TimeboxColorPicker from '../../../../../../components/Primary/ColorPicker/ColorPicker';
import EmojiSelector from '../../../../../../components/Primary/EmojiSelector/EmojiSelector';

import styles from './category-modal.module.scss';

const CategoryModal = ({ isOpen, setIsOpen, category, updateCategory, onSave, clearCategory, isEdit = false }) => {
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const onCancelHandler = () => {
    setIsOpen(false);
    clearCategory();
  };

  const onCreateHandler = async () => {
    setIsLoading(true);

    await onSave();

    clearCategory();
    setIsLoading(false);
    setIsOpen(false);
  };

  const onEditHandler = async () => {
    setIsLoading(true);

    await onSave(category.id, category);

    clearCategory();
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      width={600}
      title={<h2>{isEdit ? t('settings.categories.modal.editTitle') : t('settings.categories.modal.title')}</h2>}
      onCancel={onCancelHandler}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
          padding: '30px 34px',
          gap: 20
        }
      }}
      footer={(_) => (
        <div className={styles.footer}>
          <div className={styles.buttons}>
            <CancelButton type="text" onClick={onCancelHandler} />
            <SaveButton
              text={isEdit ? t('primary.buttons.save') : t('primary.buttons.create')}
              isLoading={isLoading}
              onClick={isEdit ? onEditHandler : onCreateHandler}
            />
          </div>
        </div>
      )}
    >
      <div className={styles.modalContent}>
        <div className={styles.titleWrapper}>
          <TextInput
            onChange={(e) => updateCategory({ title: e.target.value })}
            value={category.title}
            label={t('settings.categories.modal.categoryTitle')}
            placeholder={t('settings.categories.modal.categoryTitlePlaceholder')}
          />
          <TimeboxColorPicker
            label={'Color'}
            value={category.color}
            onChange={(e) => updateCategory({ color: e.toHex() })}
          />
          <EmojiSelector label={'Emoji'} value={category.emoji} onChange={updateCategory} />
        </div>
        <TextInput
          onChange={(e) => updateCategory({ description: e.target.value })}
          value={category.description}
          label={t('settings.categories.modal.categoryDescription')}
          placeholder={t('settings.categories.modal.categoryDescriptionPlaceholder')}
        />
      </div>
    </Modal>
  );
};

export default CategoryModal;
