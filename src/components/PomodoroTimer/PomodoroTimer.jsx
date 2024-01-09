import { useTranslation } from 'react-i18next';

import styles from './pomodoro-timer.module.scss';

const PomodoroTimer = () => {
  const [t] = useTranslation();

  return (
    <div className={styles.container}>
      <h4>{t('primary.pomodoroTimer.title')}</h4>
      <h2>20:33</h2>
    </div>
  );
};

export default PomodoroTimer;
