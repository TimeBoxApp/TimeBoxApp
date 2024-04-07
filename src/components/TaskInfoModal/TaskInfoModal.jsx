import to from 'await-to-js';
import cn from 'classnames';
import dayjs from 'dayjs';
import Skeleton from 'react-loading-skeleton';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
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
import { success, error } from '../../services/alerts';
import { deleteTask, getTask, updateTask } from '../../pages/Board/services/task';
import { useCurrentUser } from '../../services/store/useCurrentUserStore';
import { useCategories } from '../../services/store/useCategoryStore';

import styles from './task-info-modal.module.scss';

import { ReactComponent as EditIcon } from './images/edit.inline.svg';
import { DeleteFilled } from '@ant-design/icons';

const TaskInfoModal = ({ taskId, isOpen, setIsOpen, onUpdate }) => {
  const currentUser = useCurrentUser();
  const categories = useCategories();
  const [t] = useTranslation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState({
    get: true,
    update: false,
    remove: false
  });
  const [initialTaskData, setInitialTaskData] = useState(null);
  const [taskDataEdited, setTaskDataEdited] = useState(null);
  const changes = useMemo(() => {
    const changes = { ...taskDataEdited };
    _.each(changes, (value, key) => {
      if (_.isEqual(value, initialTaskData[key])) {
        delete changes[key];
      }
    });

    return changes;
  }, [initialTaskData, taskDataEdited]);
  const isChangesEmpty = useMemo(() => _.isEmpty(changes), [changes]);

  /**
   * Fetch task data on modal open
   */
  useEffect(() => {
    if (!isOpen) return;

    void getTaskData(taskId);

    return () => {
      setIsEditMode(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, taskId]);

  /**
   * Get task data handler
   * @param id
   * @returns void
   */
  const getTaskData = async (id) => {
    const [err, task] = await to(getTask(id));

    setIsLoading({
      ...isLoading,
      get: false
    });

    if (err) return error(err);

    task.taskCategories = task.categories.map((category) => category.id);

    delete task.categories;

    setInitialTaskData(task);
    setTaskDataEdited(task);
  };

  /**
   * Cancel handler
   * @param e
   */
  const onCancelHandler = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  /**
   * Remove handler
   * @returns {Promise<void>}
   */
  const onRemoveHandler = async () => {
    setIsLoading({
      ...isLoading,
      remove: true
    });

    await deleteTask(taskId);
    success(t('board.taskInfoModal.removeSuccess'));

    onUpdate();

    setIsLoading({
      ...isLoading,
      remove: false
    });
    setIsOpen(false);
  };

  /**
   * Update task handler
   * @returns {Promise<*|void>}
   */
  const onUpdateTaskHandler = async () => {
    if (isChangesEmpty) return setIsEditMode(false);

    setIsLoading({ ...isLoading, update: true });

    const [err] = await to(updateTask(taskId, changes));

    if (err) {
      error(err.message);

      setIsLoading({
        ...isLoading,
        update: false
      });
      return setIsOpen(false);
    }

    success(t('board.taskInfoModal.updateSuccess'));

    onUpdate();
    setIsLoading({ ...isLoading, update: false });
    setIsOpen(false);
    setInitialTaskData(null);
    setTaskDataEdited(null);
  };

  const header = (
    <div className={styles.header}>
      {isLoading.get ? (
        <Skeleton containerClassName={styles.titleSkeleton} />
      ) : (
        <>
          <h2>{initialTaskData?.title}</h2>
          {!isEditMode ? <EditIcon className={styles.editIcon} onClick={() => setIsEditMode(true)} /> : null}
        </>
      )}
    </div>
  );

  const modalContent = () => {
    if (isLoading.get) {
      return (
        <div className={styles.skeleton}>
          <Skeleton containerClassName={styles.additionalDataSkeleton} height={30} />
          <Skeleton containerClassName={styles.descriptionSkeleton} height={100} />
        </div>
      );
    }

    if (isOpen) {
      return isEditMode ? (
        <div className={styles.modalContentEditable}>
          <div className={styles.textData}>
            <TextInput
              onChange={(e) =>
                setTaskDataEdited({
                  ...taskDataEdited,
                  title: e.target.value
                })
              }
              value={taskDataEdited?.title}
              label={t('board.taskInfoModal.taskNameLabel')}
              placeholder={t('board.taskInfoModal.taskNamePlaceholder')}
            />
            <TextInput
              type={'textarea'}
              onChange={(e) =>
                setTaskDataEdited({
                  ...taskDataEdited,
                  description: e.target.value || null
                })
              }
              value={taskDataEdited.description}
              label={t('board.taskInfoModal.taskDescriptionLabel')}
              placeholder={t('board.taskInfoModal.taskDescriptionPlaceholder')}
            />
          </div>
          <div className={styles.additionalData}>
            <div className={styles.selectContainer}>
              <span className={styles.selectLabel}>{t('board.taskInfoModal.priority')}</span>
              <PrioritySelect
                value={taskDataEdited.priority}
                onChange={(value) =>
                  setTaskDataEdited({
                    ...taskDataEdited,
                    priority: value || null
                  })
                }
              />
            </div>
            <div className={styles.selectContainer}>
              <span className={styles.selectLabel}>{t('board.taskInfoModal.categories')}</span>
              <CategorySelect
                userCategories={categories}
                value={taskDataEdited.taskCategories}
                onChange={(value) =>
                  setTaskDataEdited({
                    ...taskDataEdited,
                    taskCategories: value
                  })
                }
              />
            </div>
            <div className={styles.selectContainer}>
              <span className={styles.selectLabel}>{t('board.taskInfoModal.dueDate')}</span>
              <DateSelect
                value={taskDataEdited.dueDate}
                onChange={(value) =>
                  setTaskDataEdited({
                    ...taskDataEdited,
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
            {initialTaskData.priority ? (
              <div className={styles.selectContainer}>
                <span className={cn(styles.selectLabel, { [styles.isPreview]: !isEditMode })}>
                  {t('board.taskInfoModal.priority')}
                </span>
                <Priority type={initialTaskData.priority} />
              </div>
            ) : null}
            {initialTaskData.taskCategories?.length ? (
              <div className={styles.selectContainer}>
                <span className={cn(styles.selectLabel, { [styles.isPreview]: !isEditMode })}>
                  {t('board.taskInfoModal.categories')}
                </span>
                {initialTaskData.taskCategories.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId);

                  if (category)
                    return (
                      <Tag key={category.id} text={category.title} emoji={category.emoji} color={category.color} />
                    );

                  return null;
                })}
              </div>
            ) : null}
            {initialTaskData.dueDate ? (
              <div className={styles.selectContainer}>
                <span className={cn(styles.selectLabel, { [styles.isPreview]: !isEditMode })}>
                  {t('board.taskInfoModal.dueDate')}
                </span>
                {dayjs(initialTaskData.dueDate).format(currentUser.dateFormat)}
              </div>
            ) : null}
          </div>
          <div className={cn(styles.textData, { [styles.isPreview]: !isEditMode })}>
            <div className={styles.description}>
              <span className={styles.descriptionLabel}>{t('board.taskInfoModal.taskDescriptionLabel')}</span>
              <p className={cn(styles.descriptionText, { [styles.isPlaceholder]: !initialTaskData.description })}>
                {initialTaskData.description || t('board.taskInfoModal.noDescription')}
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

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
                title={t('board.taskInfoModal.cancelChanges')}
                description={t('board.taskInfoModal.cancelChangesQuestion')}
                okText={t('board.taskInfoModal.yes')}
                cancelText={t('board.taskInfoModal.no')}
                onConfirm={onCancelHandler}
              >
                <CancelButton type="text" />
              </Popconfirm>
              <SaveButton
                isLoading={isLoading.update}
                isDisabled={isChangesEmpty}
                onClick={() => onUpdateTaskHandler()}
              />
            </div>
          </div>
        ) : (
          <div className={styles.footer}>
            <div className={styles.buttons}>
              {isLoading.get ? (
                <Skeleton containerClassName={styles.additionalDataSkeleton} height={35} width={100} />
              ) : (
                <Popconfirm
                  title={t('board.taskInfoModal.delete')}
                  description={t('board.taskInfoModal.deleteQuestion')}
                  okText={t('board.taskInfoModal.yes')}
                  cancelText={t('board.taskInfoModal.no')}
                  okButtonProps={{ loading: isLoading.remove }}
                  onConfirm={onRemoveHandler}
                >
                  <Button shape="round" type={'text'} danger icon={<DeleteFilled />}>
                    Remove
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        )
      }
    >
      {modalContent()}
    </Modal>
  );
};

export default TaskInfoModal;
