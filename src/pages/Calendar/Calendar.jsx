import to from 'await-to-js';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Trans, useTranslation } from 'react-i18next';

import PageTitle from '../../components/Primary/PageTitle/PageTitle';
import TimeboxCalendar from '../../components/Primary/TimeboxCalendar/TimeboxCalendar';
import { userStore } from '../../services/store/userStore';
import { error } from '../../services/alerts';
import { getCalendarEvents } from './services/calendar';
import { useCalendarActions } from '../../services/store/useCalendarStore';
import { getWeekData } from '../Board/services/user';

import styles from './calendar.module.scss';

const Calendar = () => {
  const [t] = useTranslation();
  const { setEvents, setTasks } = useCalendarActions();
  const {
    user: { fullName }
  } = userStore();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Return user events from a calendar
   * @returns {Promise<*|boolean>}
   */
  const getUserEvents = async () => {
    const [err, events] = await to(getCalendarEvents());

    if (err) return error(t('calendar.eventsError'));

    const calendarEvents = events.map((event) => {
      return {
        id: event.id,
        title: event.title,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
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
    const [err, weekData] = await to(getWeekData());

    if (err) return error(t('calendar.tasksError'));

    const { tasks = [] } = weekData;
    const todoTasks = tasks['to-do'];
    const calendarTasks = [...todoTasks];

    setTasks(calendarTasks);
  };

  /**
   * Calendar data loading handler
   * @returns {Promise<void>}
   */
  const loadCalendarData = async () => {
    setIsLoading(true);

    await Promise.all([getUserEvents(), getUserTasks()]);

    setIsLoading(false);
  };

  useEffect(() => {
    void loadCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              userName: fullName
            }}
          />
        }
        pageTitle={t('calendar.title')}
      />
      <TimeboxCalendar isLoading={isLoading} />
    </div>
  );
};

export default Calendar;
