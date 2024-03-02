import to from 'await-to-js';
import { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import PrioritySelect from '../Primary/Select/PrioritySelect/PrioritySelect';
import DateSelect from '../Primary/Select/DatePicker/DateSelect';
import CategorySelect from '../Primary/Select/CategorySelect/CategorySelect';
import TextInput from '../Primary/TextInput/TextInput';
import SaveButton from '../Primary/Buttons/SaveButton/SaveButton';
import CancelButton from '../Primary/Buttons/CancelButton/CancelButton';
import { createTask } from '../../pages/Board/services/task';
import { success, error } from '../../services/alerts';
import { userStore } from '../../services/store/userStore';

import styles from './create-task-modal.module.scss';

const CreateTaskModal = ({ isOpen, setIsOpen, onCreate, newTask, updateNewTask, clearNewTask }) => {
  const { user } = userStore();
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const onCancelHandler = () => {
    setIsOpen(false);
    clearNewTask();
  };

  const onCreateHandler = async () => {
    setIsLoading(true);
    const [err] = await to(createTask(newTask));

    setIsLoading(false);

    if (err) return error();

    success('Task created successfully');
    clearNewTask();
    onCreate();
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      width={1000}
      title={<h2>{t('board.createTaskModal.title')}</h2>}
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
              text={t('board.createTaskModal.createButton')}
              isLoading={isLoading}
              onClick={() => onCreateHandler()}
            />
          </div>
        </div>
      )}
    >
      <div className={styles.modalContent}>
        <div className={styles.textData}>
          <TextInput
            onChange={(e) => updateNewTask({ title: e.target.value })}
            value={newTask.title}
            label={t('board.createTaskModal.taskNameLabel')}
            placeholder={t('board.createTaskModal.taskNamePlaceholder')}
          />
          <TextInput
            type={'textarea'}
            onChange={(e) => updateNewTask({ description: e.target.value })}
            value={newTask.description}
            label={t('board.createTaskModal.taskDescriptionLabel')}
            placeholder={t('board.createTaskModal.taskDescriptionPlaceholder')}
          />
        </div>
        <div className={styles.additionalData}>
          <div className={styles.selectContainer}>
            <span className={styles.selectLabel}>{t('board.createTaskModal.priority')}</span>
            <PrioritySelect value={newTask.priority} onChange={(value) => updateNewTask({ priority: value })} />
          </div>
          <div className={styles.selectContainer}>
            <span className={styles.selectLabel}>{t('board.createTaskModal.categories')}</span>
            <CategorySelect
              value={newTask.taskCategories}
              userCategories={user.categories}
              onChange={(value) => updateNewTask({ taskCategories: value })}
            />
          </div>
          <div className={styles.selectContainer}>
            <span className={styles.selectLabel}>{t('board.createTaskModal.dueDate')}</span>
            <DateSelect value={newTask.dueDate} onChange={(value) => updateNewTask({ dueDate: value })} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
