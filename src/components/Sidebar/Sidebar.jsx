import { useTranslation } from 'react-i18next';

import NavigationItem from './components/NavigationItem';
import PomodoroTimer from '../PomodoroTimer/PomodoroTimer';
import { useCurrentUserActions, useCurrentUserPreferences } from '../../services/store/useCurrentUserStore';

import styles from './sidebar.module.scss';

import TimeBoxLogo from './images/logo.inline.svg';
import { ReactComponent as BoardIcon } from './images/board.inline.svg';
import { ReactComponent as BacklogIcon } from './images/backlog.inline.svg';
import { ReactComponent as SettingsIcon } from './images/settings.inline.svg';
import { ReactComponent as CalendarIcon } from './images/calendar.inline.svg';

const Sidebar = () => {
  const [t] = useTranslation();
  const preferences = useCurrentUserPreferences();
  const { userHasFeature } = useCurrentUserActions();

  const routes = [
    {
      name: t('primary.sidebar.taskBoard'),
      icon: <BoardIcon />,
      path: '/board'
    },
    {
      name: t('primary.sidebar.backlog'),
      icon: <BacklogIcon />,
      path: '/repository'
    },
    {
      name: t('primary.sidebar.calendar'),
      icon: <CalendarIcon />,
      path: '/calendar'
    },
    {
      name: t('primary.sidebar.settings'),
      icon: <SettingsIcon />,
      path: '/settings'
    }
  ];

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img src={TimeBoxLogo} alt="logo" />
        </div>
        <hr className={styles.hr} />
        <div className={styles.navigationItems}>
          {routes.map((route, index) =>
            route.feature && !userHasFeature(route.feature) ? null : (
              <NavigationItem key={index} text={route.name} path={route.path} icon={route.icon} />
            )
          )}
        </div>
      </div>
      {preferences.isPomodoroEnabled ? (
        <div className={styles.pomodoro}>
          <PomodoroTimer />
        </div>
      ) : null}
    </div>
  );
};

export default Sidebar;
