import _ from 'lodash';
import to from 'await-to-js';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TextInput from '../../../../components/Primary/TextInput/TextInput';
import CancelButton from '../../../../components/Primary/Buttons/CancelButton/CancelButton';
import SaveButton from '../../../../components/Primary/Buttons/SaveButton/SaveButton';
import { updateUserPreferences } from '../../services/preferences';
import { error, success } from '../../../../services/alerts';

import styles from '../AccountInformation/account-information.module.scss';

const ColumnStatusNames = ({ columnNames: { toDoColumnName, inProgressColumnName, doneColumnName }, onUpdate }) => {
  const [t] = useTranslation();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [columnNames, setColumnNames] = useState({ toDoColumnName, inProgressColumnName, doneColumnName });
  const [columnNamesEdited, setColumnNamesEdited] = useState({
    toDoColumnName,
    inProgressColumnName,
    doneColumnName
  });
  const changes = useMemo(() => {
    const changes = { ...columnNamesEdited };
    _.each(changes, (value, key) => {
      if (_.isEqual(value, columnNames[key])) {
        delete changes[key];
      }
    });

    return changes;
  }, [columnNames, columnNamesEdited]);
  const isChangesEmpty = useMemo(() => _.isEmpty(changes), [changes]);
  /**
   * Cancel handler
   */
  const cancelHandler = () => {
    setColumnNamesEdited(columnNames);
  };
  /**
   * Save handler
   */
  const saveHandler = async () => {
    setIsUpdateLoading(true);
    onUpdate(changes);

    const [err] = await to(updateUserPreferences(changes));

    setIsUpdateLoading(false);

    if (err) {
      onUpdate(columnNames);
      setColumnNames(columnNames);

      return error(t('settings.columnStatusNames.errorMessage'));
    }

    success(t('settings.columnStatusNames.successMessage'));
    setColumnNames(columnNamesEdited);
  };

  return (
    <div className={styles.section}>
      <h3>Column status names</h3>
      <TextInput
        onChange={(e) =>
          setColumnNamesEdited({
            ...columnNamesEdited,
            toDoColumnName: e.target.value || null
          })
        }
        value={columnNamesEdited.toDoColumnName}
        label={t('settings.columnStatusNames.toDo')}
        placeholder={t('settings.columnStatusNames.toDo')}
      />
      <TextInput
        onChange={(e) =>
          setColumnNamesEdited({
            ...columnNamesEdited,
            inProgressColumnName: e.target.value || null
          })
        }
        value={columnNamesEdited.inProgressColumnName}
        label={t('settings.columnStatusNames.inProgress')}
        placeholder={t('settings.columnStatusNames.inProgress')}
      />
      <TextInput
        onChange={(e) =>
          setColumnNamesEdited({
            ...columnNamesEdited,
            doneColumnName: e.target.value || null
          })
        }
        value={columnNamesEdited.doneColumnName}
        label={t('settings.columnStatusNames.done')}
        placeholder={t('settings.columnStatusNames.done')}
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
export default ColumnStatusNames;
