import to from 'await-to-js';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useCallback, useMemo, useState } from 'react';

import CalendarTask from './components/CalendarTask/CalendarTask';
import CustomToolbar from './components/CustomToolbar/CustomToolbar';
import { createNewEvent, updateEvent } from './services/calendar';
import { error, success } from '../../../services/alerts';

import styles from './timebox-calendar.module.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

moment.locale('ko', {
  week: {
    dow: 1,
    doy: 1
  }
});

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const TimeboxCalendar = ({ isLoading, events, tasks, addEvent, modifyEvent, setTasks }) => {
  const [t] = useTranslation();

  const [draggedEvent, setDraggedEvent] = useState();
  const eventPropGetter = useCallback(
    (event) => ({
      ...(event.isFromTimebox ? { className: styles.timeboxEvent } : { className: styles.regularEvent })
    }),
    []
  );

  const handleDragStart = useCallback((event) => {
    setDraggedEvent(event);
  }, []);

  const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent]);

  const moveEvent = useCallback(
    async ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;

      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
      modifyEvent(event.id, { ...event, start, end, allDay });

      const [err] = await to(updateEvent(event.id, { start, end }));

      if (err) return error(t('calendar.event.errorUpdate'));

      return success(t('calendar.event.successUpdate'));
    },
    [modifyEvent, t]
  );

  const newEvent = useCallback(
    async (event) => {
      event.end = moment(event.start).add(1, 'hours').toDate();
      event.isDraggable = true;

      const [err, res] = await to(createNewEvent(event));

      if (err) return error(t('calendar.event.errorCreate'));

      addEvent({ ...event, id: res?.id, isFromTimebox: true });
      const updatedTasks = tasks.filter((task) => task.id === event.taskId);
      setTasks(updatedTasks);

      return success(t('calendar.event.successCreate'));
    },
    [addEvent, setTasks, t, tasks]
  );

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }) => {
      if (draggedEvent === 'undroppable') {
        setDraggedEvent(null);
        return;
      }

      const { title, taskId } = draggedEvent;
      const event = {
        title,
        start,
        end,
        taskId,
        isAllDay
      };
      setDraggedEvent(null);
      newEvent(event);
    },
    [draggedEvent, setDraggedEvent, newEvent]
  );

  const resizeEvent = useCallback(
    async ({ event, start, end }) => {
      modifyEvent(event.id, { start, end });

      const [err] = await to(updateEvent(event.id, { start, end }));

      if (err) return error(t('calendar.event.errorUpdate'));

      return success(t('calendar.event.successUpdate'));
    },
    [modifyEvent, t]
  );

  const defaultDate = useMemo(() => new Date(), []);

  return (
    <div className={styles.calendarWrapper}>
      {isLoading ? (
        <Skeleton height={'100%'} width={280} />
      ) : (
        <div className={styles.column}>
          <h3>Current tasks</h3>
          <div className={styles.tasksWrapper}>
            {!tasks.length ? (
              <Empty style={{ marginTop: '80%' }} description={<span>{t('calendar.noTasks')}</span>} />
            ) : (
              tasks.map((task) => (
                <CalendarTask
                  key={task.id}
                  handleDragStart={handleDragStart}
                  status={task.status}
                  taskId={task.id}
                  title={task.title}
                />
              ))
            )}
          </div>
        </div>
      )}
      {isLoading ? (
        <Skeleton height={'100%'} containerClassName={styles.calendarSkeleton} />
      ) : (
        <div className={styles.calendarPreview}>
          <DragAndDropCalendar
            defaultDate={defaultDate}
            defaultView={'week'}
            dragFromOutsideItem={dragFromOutsideItem}
            draggableAccessor="isDraggable"
            eventPropGetter={eventPropGetter}
            events={events}
            localizer={localizer}
            onDropFromOutside={onDropFromOutside}
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            views={{ week: true }}
            components={{
              toolbar: CustomToolbar
            }}
            resizable
            selectable
          />
        </div>
      )}
    </div>
  );
};

export default TimeboxCalendar;
