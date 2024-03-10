import to from 'await-to-js';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { error, success } from '../../../../services/alerts';

import styles from './categories.module.scss';
import CategoryItem from './components/CategoryItem/CategoryItem';
import { createCategory, deleteCategory } from '../../services/category';
import { Empty } from 'antd';
import CreateCategoryModal from './components/CreateCategoryModal/CreateCategoryModal';

const Categories = ({ categories, onUpdate }) => {
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState({});
  const [isCreateNewCategoryModalOpen, setIsCreateNewCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    title: null,
    description: null,
    emoji: null,
    color: null
  });
  // /**
  //  * Updates the user features preferences
  //  * @returns void
  //  * @param id
  //  */
  // const updateHandler = async (id, isChecked) => {
  //   setIsLoading({
  //     ...isLoading,
  //     [key]: true
  //   });
  //   onUpdate({ [key]: isChecked });
  //
  //   const [err] = await to(updateUserPreferences({ [key]: isChecked }));
  //
  //   setIsLoading({
  //     ...isLoading,
  //     [key]: false
  //   });
  //
  //   if (err) {
  //     onUpdate({ [key]: !isChecked });
  //
  //     return error(t('settings.features.errorMessage'));
  //   }
  //
  //   return success(t('settings.features.successMessage'));
  // };

  /**
   * Category creation handler
   * @returns void
   */
  const createHandler = async () => {
    setIsLoading({
      ...isLoading,
      new: true
    });

    const [err] = await to(createCategory(newCategory));

    setIsLoading({
      ...isLoading,
      new: false
    });

    if (err) {
      return error(t('settings.features.errorMessage'));
    }

    console.log(categories);

    const newCategories = categories.push(newCategory);

    console.log(newCategories);
    onUpdate(newCategories);

    return success(t('settings.features.successMessage'));
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

    if (err) {
      return error(t('settings.categories.errorMessage'));
    }

    const newCategories = categories.filter((category) => category.id !== id);
    onUpdate(newCategories);

    return success(t('settings.categories.successMessage'));
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
            onDelete={deleteHandler}
          />
        ))
      ) : (
        <Empty
          imageStyle={{ height: 50 }}
          description={<Trans i18nKey={'settings.categories.noCategoriesPlaceholder'} components={[<br />]} />}
        />
      )}
      <CreateCategoryModal
        isOpen={isCreateNewCategoryModalOpen}
        setIsOpen={setIsCreateNewCategoryModalOpen}
        category={newCategory}
        updateCategory={setNewCategory}
        onCreate={createHandler}
      />
    </div>
  );
};

export default Categories;
