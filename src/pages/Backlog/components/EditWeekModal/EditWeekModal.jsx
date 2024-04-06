import to from 'await-to-js';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import TextInput from '../../../../components/Primary/TextInput/TextInput';
import RangeSelect from '../../../../components/Primary/Select/RangeSelect/RangeSelect';
import SaveButton from '../../../../components/Primary/Buttons/SaveButton/SaveButton';
import CancelButton from '../../../../components/Primary/Buttons/CancelButton/CancelButton';
import { success, error } from '../../../../services/alerts';
import { createWeek, updateWeek } from '../../services/week';

import styles from './edit-week-modal.module.scss';

const EditWeekModal = ({ isOpen, setIsOpen, onCreate, week, updateNewWeek, clearNewWeek }) => {
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [newWeek, setNewWeek] = useState(week);
  const [formIsValid, setFormIsValid] = useState(false);
  const isEdit = useMemo(() => !!week.id, [week]);
  const title = useMemo(() => isEdit && newWeek.name, [isEdit, newWeek]);

  useEffect(() => {
    setNewWeek(week);
  }, [week]);

  useEffect(() => {
    const isValid = newWeek.name && newWeek.startDate && newWeek.endDate;

    setFormIsValid(isValid);
  }, [newWeek]);

  const onCancelHandler = () => {
    setIsOpen(false);
    clearNewWeek();
  };

  const onSaveHandler = async () => {
    setIsLoading(true);

    const operation = isEdit ? updateWeek : createWeek;
    const { id, name, startDate, endDate } = newWeek;
    const params = isEdit ? [id, { name, startDate, endDate }] : [{ name, startDate, endDate }];

    const [err] = await to(operation(...params));

    setIsLoading(false);

    if (err)
      return error(isEdit ? t('backlog.editWeekModal.weekUpdateError') : t('backlog.editWeekModal.weekCreateError'));

    success(isEdit ? t('backlog.editWeekModal.weekUpdateSuccess') : t('backlog.editWeekModal.weekCreateSuccess'));
    clearNewWeek();
    onCreate();
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      width={700}
      title={<h2>{isEdit ? `${t('backlog.editWeekModal.edit')} ${title}` : t('backlog.editWeekModal.title')}</h2>}
      onOk={onCreate}
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
            <CancelButton type="text" onClick={onCancelHandler} />
            <SaveButton
              text={!isEdit ? t('primary.buttons.create') : t('primary.buttons.save')}
              isLoading={isLoading}
              onClick={onSaveHandler}
              isDisabled={!formIsValid}
            />
          </div>
        </div>
      )}
    >
      <div className={styles.modalContent}>
        <TextInput
          onChange={(e) => updateNewWeek({ name: e.target.value })}
          value={newWeek.name}
          label={t('backlog.editWeekModal.weekNameLabel')}
          placeholder={t('backlog.editWeekModal.weekNamePlaceholder')}
        />
        <div className={styles.additionalData}>
          <span className={styles.selectLabel}>{t('board.createTaskModal.dueDate')}</span>
          <RangeSelect startDate={newWeek.startDate} endDate={newWeek.endDate} onChange={updateNewWeek} />
        </div>
      </div>
    </Modal>
  );
};

export default EditWeekModal;
