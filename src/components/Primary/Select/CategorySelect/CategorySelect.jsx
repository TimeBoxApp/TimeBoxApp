import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import Tag from '../../Tag/Tag';

import styles from '../PrioritySelect/priority-select.module.scss';

const CategorySelect = ({ onChange, value }) => {
  const [t] = useTranslation();
  const options = [
    {
      label: 'System categories',
      options: [
        {
          value: 1,
          label: <Tag text={'Home'} emoji={'🏠'} />
        },
        {
          value: 2,
          label: <Tag text={'Work'} emoji={'🏢'} />
        },
        {
          value: 3,
          label: <Tag text={'Shopping'} emoji={'🛒'} />
        }
      ]
    },
    {
      label: 'Your categories',
      options: [
        {
          value: 4,
          label: <Tag text={'Family'} emoji={'👪'} />
        }
      ]
    }
  ];

  /**
   * Renders opyions
   * @param label
   * @returns {JSX.Element}
   */
  const optionRender = ({ label }) => {
    return <div className={styles.option}>{label}</div>;
  };

  return (
    <Select
      allowClear
      placeholder={t('primary.selects.categoryPlaceholder')}
      optionRender={optionRender}
      optionLabelProp={'label'}
      variant="filled"
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};

export default CategorySelect;
