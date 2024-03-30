import to from 'await-to-js';
import { Empty } from 'antd';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import CategoryItem from './components/CategoryItem/CategoryItem';
import CategoryModal from './components/CategoryModal/CategoryModal';
import { error, success } from '../../../../services/alerts';
import { createCategory, deleteCategory, editCategory } from '../../services/category';
import {
  useCategories,
  useCategoryActions,
  useCurrentCategory,
  useNewCategory
} from '../../../../services/store/useCategoryStore';

import styles from './categories.module.scss';

const Categories = () => {
  const [t] = useTranslation();
  const categories = useCategories();
  const newCategory = useNewCategory();
  const currentCategory = useCurrentCategory();
  const { updateNewCategory, clearNewCategory, addCategory, removeCategory, updateCategory, clearCurrentCategory } =
    useCategoryActions();
  const [isLoading, setIsLoading] = useState({});
  const [isCreateNewCategoryModalOpen, setIsCreateNewCategoryModalOpen] = useState(false);

  /**
   * Category creation handler
   * @returns void
   */
  const createHandler = async () => {
    setIsLoading({
      ...isLoading,
      new: true
    });

    const [err, createdCategory] = await to(createCategory(newCategory));

    setIsLoading({
      ...isLoading,
      new: false
    });

    if (err) return void error(t('settings.categories.errorCreate'));

    addCategory(createdCategory);
    clearNewCategory();

    return void success(t('settings.categories.successCreate'));
  };

  /**
   * Category update handler
   * @param id
   * @param data
   */
  const updateHandler = async (id, data) => {
    setIsLoading({
      ...isLoading,
      [id]: true
    });
    delete currentCategory.id;
    const [err, updatedCategory] = await to(editCategory(id, currentCategory));

    setIsLoading({
      ...isLoading,
      [id]: false
    });

    if (err) return void error(t('settings.categories.errorUpdate'));

    updateCategory(id, updatedCategory);
    clearCurrentCategory();

    return void success(t('settings.categories.successUpdate'));
  };

  /**
   * Category deletion handler
   * @param id
   */
  const deleteHandler = async (id) => {
    setIsLoading({
      ...isLoading,
      [id]: true
    });

    const [err] = await to(deleteCategory(id));

    setIsLoading({
      ...isLoading,
      [id]: false
    });

    if (err) return void error(t('settings.categories.errorDelete'));

    removeCategory(id);

    return void success(t('settings.categories.successDelete'));
  };

  return (
    <div className={styles.section}>
      <div className={styles.titleContainer}>
        <h3>{t('settings.categories.title')}</h3>
        <button type={'button'} className={styles.createButton} onClick={() => setIsCreateNewCategoryModalOpen(true)}>
          +
        </button>
      </div>
      {categories.length ? (
        categories.map(({ id, title, description, emoji, color }) => (
          <CategoryItem
            key={id}
            id={id}
            isLoading={isLoading.id}
            title={title}
            description={description}
            emoji={emoji}
            color={color}
            onEdit={updateHandler}
            onDelete={deleteHandler}
          />
        ))
      ) : (
        <Empty
          imageStyle={{ height: 50 }}
          description={<Trans i18nKey={'settings.categories.noCategoriesPlaceholder'} components={[<br />]} />}
        />
      )}
      <CategoryModal
        isOpen={isCreateNewCategoryModalOpen}
        setIsOpen={setIsCreateNewCategoryModalOpen}
        category={newCategory}
        updateCategory={updateNewCategory}
        onSave={createHandler}
        clearCategory={clearNewCategory}
      />
    </div>
  );
};

export default Categories;
