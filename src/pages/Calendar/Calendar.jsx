import to from 'await-to-js';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import PageTitle from '../../components/Primary/PageTitle/PageTitle';
import TimeboxCalendar from '../../components/Primary/TimeboxCalendar/TimeboxCalendar';
import TimeboxEmpty from '../../components/Primary/Empty/Empty';
import { error } from '../../services/alerts';
import { getCalendarEvents, getCalendarTasks } from './services/calendar';
import { useCalendarActions, useCalendarEvents, useCalendarTasks } from '../../services/store/useCalendarStore';
import { useCurrentUser, useCurrentUserPreferences } from '../../services/store/useCurrentUserStore';

import styles from './calendar.module.scss';

const Calendar = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const events = useCalendarEvents();
  const tasks = useCalendarTasks();
  const { addEvent, modifyEvent } = useCalendarActions();
  const [t] = useTranslation();
  const { setEvents, setTasks } = useCalendarActions();
  const { isCalendarConnected } = useCurrentUserPreferences();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Return user events from a calendar
   * @returns {Promise<*|boolean>}
   */
  const getUserEvents = async () => {
    if (!isCalendarConnected) return null;

    const [err, events] = await to(getCalendarEvents());

    if (err) return error(t('calendar.eventsError'));

    const calendarEvents = events.map((event) => {
      return {
        id: event.id,
        title: event.title,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        isFromTimebox: event.isFromTimebox,
        isDraggable: true
      };
    });

    return setEvents(calendarEvents);
  };

  /**
   * Returns user tasks
   * @returns *
   */
  const getUserTasks = async () => {
    if (!isCalendarConnected) return null;

    const [err, tasks] = await to(getCalendarTasks());

    if (err) return error(t('calendar.tasksError'));

    const tasksFiltered = tasks.filter((task) => !task.calendarEventId);

    setTasks(tasksFiltered);
  };

  /**
   * Calendar data loading handler
   * @returns {Promise<void>}
   */
  const loadCalendarData = async () => {
    setIsLoading(true);

    await Promise.allSettled([getUserEvents(), getUserTasks()]);

    setIsLoading(false);
  };

  useEffect(() => {
    void loadCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalendarConnected]);

  return (
    <div className={styles.pageContent}>
      <Helmet>
        <title>{t('primary.helmet.calendar')}</title>
      </Helmet>
      <PageTitle
        subtitle={
          <Trans
            i18nKey={'calendar.subtitle'}
            values={{
              userName: currentUser.fullName
            }}
          />
        }
        pageTitle={t('calendar.title')}
      />
      {!isCalendarConnected ? (
        <TimeboxEmpty
          onClick={() => navigate('/settings')}
          text={t('calendar.noCalendarConnected')}
          buttonText={t('calendar.goToSettings')}
        />
      ) : (
        <TimeboxCalendar
          isLoading={isLoading}
          events={events}
          tasks={tasks}
          addEvent={addEvent}
          modifyEvent={modifyEvent}
          setTasks={setTasks}
        />
      )}
    </div>
  );
};

export default Calendar;
