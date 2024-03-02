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
  const isEdit = useMemo(() => !!week.id, [week]);
  const title = useMemo(() => isEdit && newWeek.name, [isEdit, newWeek]);

  useEffect(() => {
    setNewWeek(week);
  }, [week]);

  const onCancelHandler = () => {
    setIsOpen(false);
    clearNewWeek();
  };

  const onCreateHandler = async () => {
    setIsLoading(true);
    const [err] = await to(createWeek(newWeek));

    setIsLoading(false);

    if (err) return error();

    success('Week created successfully');
    clearNewWeek();
    onCreate();
    setIsOpen(false);
  };

  const onUpdateHandler = async () => {
    setIsLoading(true);

    const { startDate, endDate, name } = newWeek;
    const [err] = await to(updateWeek(newWeek.id, { startDate, endDate, name }));

    setIsLoading(false);

    if (err) return error();

    success('Week updated successfully');

    clearNewWeek();
    onCreate();
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      width={700}
      title={<h2>{isEdit ? `Edit ${title}` : t('backlog.editWeekModal.title')}</h2>}
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
            <CancelButton type="text" onClick={() => onCancelHandler()} />
            <SaveButton
              text={!isEdit ? t('backlog.editWeekModal.createButton') : null}
              isLoading={isLoading}
              onClick={isEdit ? onUpdateHandler : onCreateHandler}
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
