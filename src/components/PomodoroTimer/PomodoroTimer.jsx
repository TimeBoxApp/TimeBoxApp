import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

import { usePomodoroStore } from '../../services/store/usePomodoroStore';

import styles from './pomodoro-timer.module.scss';

import { ReactComponent as ReplayIcon } from './images/replay.inline.svg';

const PomodoroTimer = () => {
  const { t } = useTranslation();
  const { timer, isPaused, startTimer, pauseTimer, resetTimer, switchMode } = usePomodoroStore();
  const endSoundRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        usePomodoroStore.setState((state) => ({ timer: state.timer - 1 }));

        if (usePomodoroStore.getState().timer === 0) {
          switchMode();
          // Play the end sound
          if (endSoundRef.current) {
            endSoundRef.current.play().catch((error) => console.error('Audio play failed', error));
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, switchMode]);
  const displayTime = `${Math.floor(timer / 60)}:${`0${timer % 60}`.slice(-2)}`;

  return (
    <div className={styles.container}>
      <span className={styles.title}>{t('primary.pomodoroTimer.title')}</span>
      <span className={styles.timer}>{displayTime}</span>
      <div className={styles.buttons}>
        {isPaused ? (
          <Button size={'small'} type="primary" shape={'round'} onClick={startTimer}>
            {t('primary.pomodoroTimer.start')}
          </Button>
        ) : (
          <Button size={'small'} shape={'round'} onClick={pauseTimer}>
            {t('primary.pomodoroTimer.pause')}
          </Button>
        )}
        <Button size={'small'} type={'text'} icon={<ReplayIcon />} onClick={resetTimer} />
      </div>
      <audio ref={endSoundRef} src={`${process.env.PUBLIC_URL}/timer-end-sound.mp3`} preload="auto" />
    </div>
  );
};

export default PomodoroTimer;
