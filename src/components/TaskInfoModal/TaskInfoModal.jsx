import cn from 'classnames';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Modal, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

import PrioritySelect from '../Primary/Select/PrioritySelect/PrioritySelect';
import DateSelect from '../Primary/Select/DatePicker/DateSelect';
import CategorySelect from '../Primary/Select/CategorySelect/CategorySelect';
import TextInput from '../Primary/TextInput/TextInput';
import SaveButton from '../Primary/Buttons/SaveButton/SaveButton';
import CancelButton from '../Primary/Buttons/CancelButton/CancelButton';
import Priority from '../Primary/Priority/Priority';
import Tag from '../Primary/Tag/Tag';
import { success } from '../../services/alerts';
import { userStore } from '../../services/store/userStore';
import { deleteTask } from '../../pages/Board/services/task';

import styles from './task-info-modal.module.scss';

import { ReactComponent as EditIcon } from './images/edit.inline.svg';
import { DeleteFilled } from '@ant-design/icons';

const TaskInfoModal = ({ task, isOpen, setIsOpen, onUpdate }) => {
  const { user } = userStore();
  const [t] = useTranslation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState({ update: false, remove: false });
  const [taskData, setTaskData] = useState(task);

  const onCancelHandler = (e) => {
    e.stopPropagation();
    setIsOpen(false);

    if (isEditMode) {
      setIsEditMode(false);
      setTaskData(task);
    }
  };

  const onRemoveHandler = async () => {
    setIsLoading({
      ...isLoading,
      remove: true
    });
    await deleteTask(task.id);
    success('Task successfully removed');

    // TODO: add refetching tasks

    setIsLoading({
      ...isLoading,
      remove: false
    });
    setIsOpen(false);
  };

  const onUpdateTaskHandler = async () => {
    console.log(taskData);
    setIsLoading({ ...isLoading, update: true });
    // await createTask(newTask);
    success('Task updated successfully');
    // onCreate();
    setIsOpen(false);
    setIsLoading({ ...isLoading, update: false });
    // setTaskData(null);
  };

  const header = (
    <div className={styles.header}>
      <h2>{taskData.title}</h2>
      {!isEditMode ? <EditIcon className={styles.editIcon} onClick={() => setIsEditMode(true)} /> : null}
    </div>
  );

  return (
    <Modal
      open={isOpen}
      width={isEditMode ? 1000 : 800}
      title={header}
      onCancel={onCancelHandler}
      wrapClassName={styles.modalContentEditable}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
          padding: isEditMode ? '30px 34px' : '30px 34px 20px 34px'
        }
      }}
      footer={(_) =>
        isEditMode ? (
          <div className={styles.footer}>
            <div className={styles.buttons}>
              <Popconfirm
                title="Cancel the changes"
                description="Are you sure you want to cancel the changes?"
                okText="Yes"
                cancelText="No"
                onConfirm={onCancelHandler}
              >
                <CancelButton type="text" />
              </Popconfirm>
              <SaveButton isLoading={isLoading.update} onClick={() => onUpdateTaskHandler()} />
            </div>
          </div>
        ) : (
          <div className={styles.footer}>
            <div className={styles.buttons}>
              <Popconfirm
                title="Delete the task"
                description="Are you sure you want to delete the task?"
                okText="Yes"
                cancelText="No"
                okButtonProps={{ loading: isLoading.remove }}
                onConfirm={onRemoveHandler}
              >
                <Button shape="round" type={'text'} danger icon={<DeleteFilled />}>
                  Remove
                </Button>
              </Popconfirm>
            </div>
          </div>
        )
      }
    >
      {isEditMode ? (
        <div className={styles.modalContentEditable}>
          <div className={styles.textData}>
            <TextInput
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  title: e.target.value
                })
              }
              value={taskData.title}
              label={t('board.createTaskModal.taskNameLabel')}
              placeholder={t('board.createTaskModal.taskNamePlaceholder')}
            />
            <TextInput
              type={'textarea'}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.value
                })
              }
              value={taskData.description}
              label={t('board.createTaskModal.taskDescriptionLabel')}
              placeholder={t('board.createTaskModal.taskDescriptionPlaceholder')}
            />
          </div>
          <div className={styles.additionalData}>
            <div className={styles.selectContainer}>
              <span className={styles.selectLabel}>{t('board.createTaskModal.priority')}</span>
              <PrioritySelect
                value={taskData.priority}
                onChange={(value) =>
                  setTaskData({
                    ...taskData,
                    priority: value
                  })
                }
              />
            </div>
            <div className={styles.selectContainer}>
              <span className={styles.selectLabel}>{t('board.createTaskModal.categories')}</span>
              <CategorySelect
                userCategories={user.categories}
                value={taskData.categoryId}
                onChange={(value) =>
                  setTaskData({
                    ...taskData,
                    categoryId: value
                  })
                }
              />
            </div>
            <div className={styles.selectContainer}>
              <span className={styles.selectLabel}>{t('board.createTaskModal.dueDate')}</span>
              <DateSelect
                value={taskData.dueDate}
                onChange={(value) =>
                  setTaskData({
                    ...taskData,
                    dueDate: value
                  })
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={cn(styles.modalContentEditable, { [styles.isPreview]: !isEditMode })}>
          <div className={cn(styles.additionalData, { [styles.isPreview]: !isEditMode })}>
            {taskData.priority ? (
              <div className={styles.selectContainer}>
                <span className={cn(styles.selectLabel, { [styles.isPreview]: !isEditMode })}>
                  {t('board.createTaskModal.priority')}
                </span>
                <Priority type={taskData.priority} />
              </div>
            ) : null}
            {taskData.categoryId ? (
              <div className={styles.selectContainer}>
                <span className={cn(styles.selectLabel, { [styles.isPreview]: !isEditMode })}>
                  {t('board.createTaskModal.categories')}
                </span>
                {taskData.categories.map((category) => (
                  <Tag key={category.id} text={category.title} emoji={category.emoji} color={category.color} />
                ))}
              </div>
            ) : null}
            {taskData.dueDate ? (
              <div className={styles.selectContainer}>
                <span className={cn(styles.selectLabel, { [styles.isPreview]: !isEditMode })}>
                  {t('board.createTaskModal.dueDate')}
                </span>
                {dayjs(taskData.dueDate).format(user.dateFormat)}
              </div>
            ) : null}
          </div>
          <div className={cn(styles.textData, { [styles.isPreview]: !isEditMode })}>
            <div className={styles.description}>
              <span className={styles.descriptionLabel}>{t('board.createTaskModal.taskDescriptionLabel')}</span>
              <p className={cn(styles.descriptionText, { [styles.isPlaceholder]: !taskData.description })}>
                {taskData.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskInfoModal;
