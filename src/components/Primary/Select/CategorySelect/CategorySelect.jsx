import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import Tag from '../../Tag/Tag';

import styles from '../PrioritySelect/priority-select.module.scss';

const CategorySelect = ({ onChange, value, userCategories = [] }) => {
  const [t] = useTranslation();
  const options = userCategories.map((category) => ({
    value: category.id,
    label: <Tag key={category.id} text={category.title} emoji={category.emoji} color={category.color} />
  }));

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
