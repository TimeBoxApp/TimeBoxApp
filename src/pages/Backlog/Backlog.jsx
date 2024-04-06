import to from 'await-to-js';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Trans, useTranslation } from 'react-i18next';

import PageTitle from '../../components/Primary/PageTitle/PageTitle';
import BacklogWeek from '../../components/BacklogWeek/BacklogWeek';
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import EditWeekModal from './components/EditWeekModal/EditWeekModal';
import useBacklogStore from '../../services/store/useBacklogStore';
import { error } from '../../services/alerts';
import { getBacklogData } from './services/user';
import { useCurrentUser } from '../../services/store/useCurrentUserStore';
import { useCurrentWeekActions } from '../../services/store/useCurrentWeekStore';

const Backlog = () => {
  const { fullName } = useCurrentUser();
  const { setCurrentWeek } = useCurrentWeekActions();
  const {
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    newTask,
    updateNewTask,
    clearNewTask,
    setBacklogData,
    clearNewWeek,
    updateNewWeek,
    isWeekModalOpen,
    setIsWeekModalOpen,
    weekToEdit
  } = useBacklogStore((state) => ({
    isCreateTaskModalOpen: state.isCreateTaskModalOpen,
    setIsCreateTaskModalOpen: state.setIsCreateTaskModalOpen,
    newTask: state.newTask,
    updateNewTask: state.updateNewTask,
    clearNewTask: state.clearNewTask,
    setBacklogData: state.setBacklogData,
    clearNewWeek: state.clearNewWeek,
    updateNewWeek: state.updateNewWeek,
    isWeekModalOpen: state.isWeekModalOpen,
    setIsWeekModalOpen: state.setIsWeekModalOpen,
    weekToEdit: state.newWeek
  }));
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const [t] = useTranslation();

  function transformData(input) {
    // Initializing the output structure
    const output = { tasks: {}, weeks: {} };

    const { weeks, backlogTasks } = input;

    weeks.forEach((week) => {
      output.weeks[week.id] = {
        id: week.id.toString(),
        name: week.name,
        startDate: week.startDate,
        endDate: week.endDate,
        status: week.status,
        taskIds: []
      };

      // Process each task in the week.tasks array
      week.tasks.forEach((task) => {
        output.tasks[task.id] = {
          id: task.id.toString(),
          title: task.title,
          taskCategories: task.categories,
          priority: task.priority,
          status: task.status,
          backlogRank: task.backlogRank
        };

        output.weeks[week.id].taskIds.push(task.id);
      });
    });

    output.weeks.backlog = {
      id: 'backlog',
      name: 'Backlog',
      taskIds: []
    };

    if (backlogTasks) {
      // Process each task in the week.tasks array
      backlogTasks.forEach((task) => {
        output.tasks[task.id] = {
          id: task.id.toString(),
          title: task.title,
          taskCategories: task.categories,
          priority: task.priority,
          backlogRank: task.backlogRank
        };

        output.weeks.backlog.taskIds.push(task.id);
      });
    }

    return output;
  }

  /**
   * Get backlog tasks handler
   * @returns *
   */
  const getBacklogDetails = async () => {
    setIsLoading(true);

    const [err, backlogData] = await to(getBacklogData());

    if (err) {
      setIsLoading(false);

      return error();
    }

    setBacklogData(transformData(backlogData));
    setCurrentWeek({ id: backlogData?.currentWeekId?.toString() });
    setIsLoading(false);
  };

  /**
   * Get week details on mount
   */
  useEffect(() => {
    void getBacklogDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Helmet>
        <title>{t('primary.helmet.backlog')}</title>
      </Helmet>
      <PageTitle
        subtitle={
          <Trans
            i18nKey={'backlog.subtitle'}
            values={{
              userName: fullName
            }}
          />
        }
        pageTitle={t('backlog.title')}
      />
      <BacklogWeek onUpdate={getBacklogDetails} />
      <EditWeekModal
        isOpen={isWeekModalOpen}
        setIsOpen={setIsWeekModalOpen}
        onCreate={getBacklogDetails}
        week={weekToEdit}
        clearNewWeek={clearNewWeek}
        updateNewWeek={updateNewWeek}
      />
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        setIsOpen={setIsCreateTaskModalOpen}
        onCreate={getBacklogDetails}
        newTask={newTask}
        clearNewTask={clearNewTask}
        updateNewTask={updateNewTask}
      />
    </div>
  );
};

export default Backlog;
