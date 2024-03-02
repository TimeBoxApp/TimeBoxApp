import { Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { Tag } from 'antd';

import styles from '../PrioritySelect/priority-select.module.scss';

const CategorySelect = ({ onChange, value, userCategories = [] }) => {
  const [t] = useTranslation();
  const options = userCategories.map((category) => ({
    value: category.id,
    label: category.title,
    color: category.color,
    emoji: category.emoji
  }));
  const filteredOptions = options.filter((o) => !value.includes(o.value));

  const tagRender = (props) => {
    const { label, value, closable, onClose, color } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {options.find((o) => o.value === props.value).label}
      </Tag>
    );
  };

  return (
    <Select
      allowClear
      // maxCount={3}
      mode={'multiple'}
      placeholder={t('primary.selects.categoryPlaceholder')}
      tagRender={tagRender}
      variant="filled"
      options={filteredOptions}
      optionRender={(option) => (
        <Space>
          <span role="img" aria-label={option.data.label}>
            {option.data.emoji}
          </span>
          {option.data.label}
        </Space>
      )}
      onChange={onChange}
      value={value}
    />
  );
};

export default CategorySelect;
