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
import Categories from './components/Categories/Categories';
import CalendarIntegration from './components/CalendarIntegration/CalendarIntegration';
import { getUserStats } from './services/user';
import { getCategories } from './services/category';
import { error } from '../../services/alerts';
import { useCategoryActions } from '../../services/store/useCategoryStore';
import {
  useCurrentUser,
  useCurrentUserActions,
  useCurrentUserColumnMapping,
  useCurrentUserPreferences
} from '../../services/store/useCurrentUserStore';

import styles from './settings.module.scss';

const Settings = () => {
  const [t] = useTranslation();
  const { updateUserInfo, updateUserPreferences, updateColumnNames } = useCurrentUserActions();
  const currentUser = useCurrentUser();
  const preferences = useCurrentUserPreferences();
  const columnNames = useCurrentUserColumnMapping();
  const { setCategories } = useCategoryActions();
  const [userStats, setUserStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadSettingsData = async () => {
    setIsLoading(true);
    await Promise.all([getStatsHandler(), getUserCategories()]);
    setIsLoading(false);
  };

  /**
   * Get user stats on mount
   */
  useEffect(() => {
    void loadSettingsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Get user stats handler
   * @returns {Promise<*|boolean>}
   */
  const getStatsHandler = async () => {
    const [err, stats] = await to(getUserStats());

    if (err) return error();

    return setUserStats(stats);
  };

  /**
   * Get user categories handler
   * @returns {Promise<*|boolean>}
   */
  const getUserCategories = async () => {
    const [err, categories] = await to(getCategories());

    if (err) return error();

    return setCategories(categories);
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
              userName: currentUser.fullName
            }}
          />
        }
        pageTitle={t('settings.title')}
      />
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 950: 2, 1200: 3 }} className={styles.settingsContainer}>
        <Masonry columnsCount={3} gutter={'40px'}>
          {!isLoading ? <UserInfo user={currentUser} userStats={userStats} /> : <Skeleton height={210} />}
          {!isLoading ? (
            <AccountInformation userData={currentUser} onUpdate={updateUserInfo} />
          ) : (
            <Skeleton height={405} />
          )}
          {!isLoading ? (
            <Features preferences={preferences} onUpdate={updateUserPreferences} />
          ) : (
            <Skeleton height={165} />
          )}
          {!isLoading ? (
            <CalendarIntegration preferences={preferences} onUpdate={updateUserPreferences} />
          ) : (
            <Skeleton height={340} />
          )}
          {!isLoading ? (
            <ColumnStatusNames columnNames={columnNames} onUpdate={updateColumnNames} />
          ) : (
            <Skeleton height={340} />
          )}
          {!isLoading ? <Categories /> : <Skeleton height={340} />}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default Settings;
