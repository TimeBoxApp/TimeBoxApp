import { useTranslation } from 'react-i18next';

import NavigationItem from './components/NavigationItem';
import PomodoroTimer from '../PomodoroTimer/PomodoroTimer';

import styles from './sidebar.module.scss';

import TimeBoxLogo from './images/logo.inline.svg';
import { ReactComponent as BoardIcon } from './images/board.inline.svg';
import { ReactComponent as BacklogIcon } from './images/backlog.inline.svg';
import { ReactComponent as ReportsIcon } from './images/reports.inline.svg';
import { ReactComponent as SettingsIcon } from './images/settings.inline.svg';

const Sidebar = () => {
  const [t] = useTranslation();

  const routes = [
    {
      name: t('primary.sidebar.taskBoard'),
      icon: <BoardIcon />,
      path: '/board'
    },
    {
      name: t('primary.sidebar.backlog'),
      icon: <BacklogIcon />,
      path: '/backlog'
    },
    {
      name: t('primary.sidebar.reports'),
      icon: <ReportsIcon />,
      path: '/reports'
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
          {routes.map((route, index) => (
            <NavigationItem key={index} text={route.name} path={route.path} icon={route.icon} />
          ))}
        </div>
      </div>
      <div className={styles.pomodoro}>
        <PomodoroTimer />
      </div>
    </div>
  );
};

export default Sidebar;
