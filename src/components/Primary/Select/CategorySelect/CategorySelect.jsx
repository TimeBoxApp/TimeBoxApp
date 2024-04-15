import to from 'await-to-js';
import { useState } from 'react';
import { Button, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import Tag from '../../Tag/Tag';
import CategoryModal from '../../../../pages/Settings/components/Categories/components/CategoryModal/CategoryModal';
import { useCategories, useCategoryActions, useNewCategory } from '../../../../services/store/useCategoryStore';
import { createCategory } from '../../../../pages/Settings/services/category';
import { error, success } from '../../../../services/alerts';

import styles from './category-select.module.scss';

const CategorySelect = ({ onChange, value }) => {
  const [t] = useTranslation();
  const categories = useCategories();
  const newCategory = useNewCategory();
  const { updateNewCategory, clearNewCategory, addCategory } = useCategoryActions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createHandler = async () => {
    const [err, createdCategory] = await to(createCategory(newCategory));

    if (err) return void error(t('settings.categories.errorCreate'));

    addCategory(createdCategory);
    clearNewCategory();

    return void success(t('settings.categories.successCreate'));
  };

  return (
    <>
      <Select
        allowClear
        showSearch
        mode="multiple"
        placeholder={t('primary.selects.categoryPlaceholder')}
        onChange={onChange}
        value={value}
        style={{ width: '100%' }}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Button className={styles.addCategory} type="text" onClick={() => setIsModalOpen(true)}>
              {t('primary.selects.createCategory')}
            </Button>
          </>
        )}
      >
        {categories.map((category) => (
          <Select.Option key={category.id} value={category.id}>
            <Space>
              <Tag color={category.color} text={category.title} emoji={category.emoji} />
            </Space>
          </Select.Option>
        ))}
      </Select>
      <CategoryModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        category={newCategory}
        updateCategory={updateNewCategory}
        onSave={createHandler}
        clearCategory={clearNewCategory}
      />
    </>
  );
};

export default CategorySelect;
