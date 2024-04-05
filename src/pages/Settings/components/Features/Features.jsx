import to from 'await-to-js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TimeBoxSwitch from '../../../../components/Primary/TimeBoxSwitch/TimeBoxSwitch';
import { updateUserPreferences } from '../../services/preferences';
import { error, success } from '../../../../services/alerts';

import styles from './features.module.scss';

const Features = ({ preferences: { isPomodoroEnabled }, onUpdate }) => {
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState({
    isPomodoroEnabled: false
  });
  const features = [
    {
      label: t('settings.features.pomodoro'),
      key: 'isPomodoroEnabled',
      isChecked: isPomodoroEnabled
    }
  ];
  /**
   * Updates the user features preferences
   * @param key
   * @param isChecked
   * @returns void
   */
  const updateHandler = async (key, isChecked) => {
    setIsLoading({
      ...isLoading,
      [key]: true
    });
    onUpdate({ [key]: isChecked });

    const [err] = await to(updateUserPreferences({ [key]: isChecked }));

    setIsLoading({
      ...isLoading,
      [key]: false
    });

    if (err) {
      onUpdate({ [key]: !isChecked });

      return error(t('settings.features.errorMessage'));
    }

    return success(t('settings.features.successMessage'));
  };

  return (
    <div className={styles.section}>
      <h3>{t('settings.features.title')}</h3>
      {features.map(({ key, label, isChecked }) => (
        <TimeBoxSwitch
          key={key}
          onChange={(isChecked) => updateHandler(key, isChecked)}
          label={label}
          isLoading={isLoading[key]}
          checked={isChecked}
        />
      ))}
    </div>
  );
};

export default Features;
