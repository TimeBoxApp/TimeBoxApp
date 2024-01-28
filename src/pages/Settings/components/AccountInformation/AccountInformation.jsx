import dayjs from 'dayjs';
import to from 'await-to-js';
import _ from 'lodash';
import { Button } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TextInput from '../../../../components/Primary/TextInput/TextInput';
import TimeBoxSelect from '../../../../components/Primary/Select/TimeBoxSelect/Select';
import CancelButton from '../../../../components/Primary/Buttons/CancelButton/CancelButton';
import SaveButton from '../../../../components/Primary/Buttons/SaveButton/SaveButton';
import { updateUserData } from '../../services/user';
import { success, error } from '../../../../services/alerts';

import styles from './account-information.module.scss';

const AccountInformation = ({ userData, onUpdate }) => {
  const [t] = useTranslation();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [userDataEdited, setUserDataEdited] = useState(userData);
  const availableDateFormats = ['DD.MM.YYYY', 'MM/DD/YYYY', 'MMM DD, YYYY'];
  const options = availableDateFormats.map((format) => ({
    label: `${dayjs().format(format)} (${format})`,
    value: format
  }));
  const changes = useMemo(() => {
    const changes = { ...userDataEdited };
    _.each(changes, (value, key) => {
      if (_.isEqual(value, userData[key])) {
        delete changes[key];
      }
    });

    return changes;
  }, [userData, userDataEdited]);
  const isChangesEmpty = useMemo(() => _.isEmpty(changes), [changes]);
  /**
   * Cancel handler
   */
  const cancelHandler = () => {
    return setUserDataEdited(userData);
  };
  /**
   * Save handler
   */
  const saveHandler = async () => {
    setIsUpdateLoading(true);
    onUpdate(changes);

    const [err] = await to(updateUserData(changes));

    setIsUpdateLoading(false);

    if (err) {
      onUpdate(userData);

      return error(t('settings.accountInformation.errorMessage'));
    }

    success(t('settings.accountInformation.successMessage'));
  };

  return (
    <div className={styles.section}>
      <h3>Account information</h3>
      <div className={styles.name}>
        <TextInput
          onChange={(e) => setUserDataEdited({ ...userDataEdited, firstName: e.target.value })}
          value={userDataEdited.firstName}
          label={t('primary.userFields.firstName')}
          placeholder={t('primary.userFields.firstName')}
          clearable={false}
        />
        <TextInput
          onChange={(e) => setUserDataEdited({ ...userDataEdited, lastName: e.target.value })}
          value={userDataEdited.lastName}
          label={t('primary.userFields.lastName')}
          placeholder={t('primary.userFields.lastName')}
          clearable={false}
        />
      </div>
      <TextInput
        onChange={(e) => setUserDataEdited({ ...userDataEdited, email: e.target.value })}
        value={userDataEdited.email}
        label={t('primary.userFields.email')}
        placeholder={t('primary.userFields.email')}
        clearable={false}
      />
      <div className={styles.passwordContainer}>
        <TextInput
          value={'*********'}
          disabled
          label={t('primary.userFields.password')}
          placeholder={t('primary.userFields.password')}
          clearable={false}
        />
        <Button className={styles.changePasswordButton} shape="round" size={'small'}>
          {t('settings.accountInformation.changePassword')}
        </Button>
      </div>
      <TimeBoxSelect
        onChange={(e) => setUserDataEdited({ ...userDataEdited, dateFormat: e })}
        value={userDataEdited.dateFormat}
        options={options}
        optionLabelProp={'value'}
        label={t('primary.userFields.dateFormat')}
        placeholder={t('primary.userFields.dateFormatPlaceholder')}
      />
      {!isChangesEmpty ? (
        <div className={styles.buttons}>
          <CancelButton onClick={cancelHandler} />
          <SaveButton isDisabled={isUpdateLoading} isLoading={isUpdateLoading} onClick={saveHandler} />
        </div>
      ) : null}
    </div>
  );
};

export default AccountInformation;
