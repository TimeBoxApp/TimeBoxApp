import { Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import Tag from '../../Tag/Tag';
import { useCategories } from '../../../../services/store/useCategoryStore';

const CategorySelect = ({ onChange, value }) => {
  const [t] = useTranslation();
  const categories = useCategories();

  return (
    <Select
      allowClear
      showSearch
      mode="multiple"
      placeholder={t('primary.selects.categoryPlaceholder')}
      onChange={onChange}
      value={value}
      style={{ width: '100%' }}
    >
      {categories.map((category) => (
        <Select.Option key={category.id} value={category.id}>
          <Space>
            <Tag color={category.color} text={category.title} emoji={category.emoji} />
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};

export default CategorySelect;
