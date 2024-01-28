import CountUp from 'react-countup';
import { Trans, useTranslation } from 'react-i18next';

import styles from './user-info.module.scss';

const UserInfo = ({ user, userStats }) => {
  const [t] = useTranslation();
  const stats = [
    {
      label: <Trans i18nKey={'settings.userInfo.weeksTimeboxed'} values={{ count: userStats.totalCompletedWeeks }} />,
      value: userStats.totalCompletedWeeks
    },
    {
      label: t('settings.userInfo.totalCompleted'),
      value: userStats.totalCompletedTasks
    },
    {
      label: <Trans i18nKey={'settings.userInfo.backlogItems'} values={{ count: userStats.totalBacklogItems }} />,
      value: userStats.totalBacklogItems
    }
  ];

  return (
    <div className={styles.section}>
      <div className={styles.userInfo}>
        <span className={styles.userName}>{user.fullName}</span>
        <span className={styles.subtitle}>{user.email}</span>
      </div>
      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statsItem}>
            <h3>
              <CountUp separator=" " end={stat.value || 0} />
            </h3>
            <span className={styles.statsLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInfo;
