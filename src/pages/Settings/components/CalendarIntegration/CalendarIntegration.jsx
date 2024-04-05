import to from 'await-to-js';
import { useEffect, useState } from 'react';
import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { error, success } from '../../../../services/alerts';
import { disconnectGoogleCalendar, getGoogleCalendarOAuthLink } from '../../services/calendar';

import styles from './calendar-integration.module.scss';

import { LoadingOutlined } from '@ant-design/icons';
import { ReactComponent as GoogleCalendarIcon } from './images/google-calendar.inline.svg';

const CalendarIntegration = ({ preferences: { googleAccessToken }, onUpdate }) => {
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Listener for query param to show the alert
   */
  useEffect(() => {
    const connectCalendarSuccess = searchParams.get('connectCalendarSuccess');
    if (connectCalendarSuccess !== null) {
      searchParams.delete('connectCalendarSuccess');
      setSearchParams(searchParams);

      if (connectCalendarSuccess === 'true') return success(t('settings.calendar.success'));

      return error(t('settings.calendar.error'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Calendar connect handler
   * @returns *
   */
  const connectHandler = async () => {
    setIsLoading(true);

    const [err, res] = await to(getGoogleCalendarOAuthLink());

    if (err) {
      setIsLoading(false);

      return error(t('settings.calendar.error'));
    }

    window.location.replace(res.redirectUrl);
  };

  /**
   * Calendar disconnect handler
   * @returns void
   */
  const disconnectHandler = async () => {
    setIsLoading(true);

    const [err] = await to(disconnectGoogleCalendar());

    setIsLoading(false);

    if (err) return error(t('settings.calendar.errorDisconnect'));

    onUpdate({ googleAccessToken: false });

    return success(t('settings.calendar.successDisconnect'));
  };

  return (
    <div className={styles.section}>
      <h3>{t('settings.calendar.title')}</h3>
      <div className={styles.calendarWrapper}>
        <div className={styles.googleCalendar}>
          <GoogleCalendarIcon className={styles.calendarIcon} />
          <div className={styles.textWrapper}>
            <h4 className={styles.title}>{t('settings.calendar.google')}</h4>
            <span className={styles.status}>
              {googleAccessToken ? t('settings.calendar.connected') : t('settings.calendar.notConnected')}
            </span>
          </div>
        </div>
        {isLoading ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : googleAccessToken ? (
          <Button danger size={'small'} shape={'round'} onClick={disconnectHandler}>
            {t('settings.calendar.disconnect')}
          </Button>
        ) : (
          <Button onClick={connectHandler}>{t('settings.calendar.connect')}</Button>
        )}
      </div>
    </div>
  );
};

export default CalendarIntegration;
