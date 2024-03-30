import { useState } from 'react';
import { Dropdown, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import CategoryModal from '../CategoryModal/CategoryModal';
import { useCategoryActions, useCurrentCategory } from '../../../../../../services/store/useCategoryStore';

import styles from './category-item.module.scss';

import { ReactComponent as MoreIcon } from './images/more.inline.svg';
import { useTranslation } from 'react-i18next';

const CategoryItem = ({ id, title, description, emoji, color, isLoading, onDelete, onEdit }) => {
  const currentCategory = useCurrentCategory();
  const [t] = useTranslation();
  const { updateCurrentCategory, clearCurrentCategory, getCategory } = useCategoryActions();
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const items = [
    {
      label: t('settings.categories.editCategory'),
      key: '1',
      onClick: () => onEditClickHandler(id)
    },
    {
      label: t('settings.categories.deleteCategory'),
      key: '2',
      danger: true,
      onClick: () => onDelete(id)
    }
  ];

  const onEditClickHandler = (id) => {
    const currentCategory = getCategory(id);

    updateCurrentCategory(currentCategory);
    setIsEditCategoryModalOpen(true);
  };

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryText}>
        <span className={styles.categoryTitle}>
          {emoji ? <span>{emoji}</span> : null}
          {title}
          {color ? <span className={styles.colorBox} style={{ background: `#${color}` }} /> : null}
        </span>
        {description ? <span className={styles.categoryDescription}>{description}</span> : null}
      </div>
      {isLoading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
      ) : (
        <Dropdown menu={{ items }}>
          <MoreIcon className={styles.moreIcon} />
        </Dropdown>
      )}
      <CategoryModal
        isOpen={isEditCategoryModalOpen}
        setIsOpen={setIsEditCategoryModalOpen}
        category={currentCategory}
        updateCategory={updateCurrentCategory}
        onSave={onEdit}
        clearCategory={clearCurrentCategory}
        isEdit
      />
    </div>
  );
};

export default CategoryItem;
