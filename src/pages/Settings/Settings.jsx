import to from 'await-to-js';
import Skeleton from 'react-loading-skeleton';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Trans, useTranslation } from 'react-i18next';

import PageTitle from '../../components/Primary/PageTitle/PageTitle';
import UserInfo from './components/UserInfo/UserInfo';
import AccountInformation from './components/AccountInformation/AccountInformation';
import Features from './components/Features/Features';
import ColumnStatusNames from './components/ColumnStatusNames/ColumnStatusNames';
import { userStore } from '../../services/store/userStore';
import { getUserStats } from './services/user';
import { error } from '../../services/alerts';

import styles from './settings.module.scss';

const Settings = () => {
  const [t] = useTranslation();
  const {
    user: { firstName, lastName, email, dateFormat, fullName, preferences },
    updateUserInfo,
    updateUserPreferences
  } = userStore();
  const [userStats, setUserStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Get user stats on mount
   */
  useEffect(() => {
    void getStatsHandler();
  }, []);

  /**
   * Get user stats handler
   * @returns {Promise<void|boolean>}
   */
  const getStatsHandler = async () => {
    setIsLoading(true);
    const [err, stats] = await to(getUserStats());

    setIsLoading(false);

    if (err) {
      return error();
    }

    return setUserStats(stats);
  };

  return (
    <div className={styles.pageContent}>
      <Helmet>
        <title>{t('primary.helmet.settings')}</title>
      </Helmet>
      <PageTitle
        subtitle={
          <Trans
            i18nKey={'settings.subtitle'}
            values={{
              userName: fullName
            }}
          />
        }
        pageTitle={t('settings.title')}
      />
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 950: 2, 1200: 3 }}>
        <Masonry columnsCount={3} gutter={'40px'} className={styles.settingsContainer}>
          {!isLoading ? <UserInfo user={{ fullName, email }} userStats={userStats} /> : <Skeleton height={210} />}
          {!isLoading ? (
            <AccountInformation userData={{ firstName, lastName, email, dateFormat }} onUpdate={updateUserInfo} />
          ) : (
            <Skeleton height={405} />
          )}
          {!isLoading ? (
            <Features preferences={preferences} onUpdate={updateUserPreferences} />
          ) : (
            <Skeleton height={165} />
          )}
          {!isLoading ? (
            <ColumnStatusNames preferences={preferences} onUpdate={updateUserPreferences} />
          ) : (
            <Skeleton height={340} />
          )}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default Settings;