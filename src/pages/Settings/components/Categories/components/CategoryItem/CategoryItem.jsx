import cn from 'classnames';

import styles from './category-item.module.scss';
import { Dropdown, Space, Spin } from 'antd';

import { ReactComponent as MoreIcon } from './images/more.inline.svg';
import { LoadingOutlined } from '@ant-design/icons';

const CategoryItem = ({ id, title, description, emoji, color, isLoading, onDelete }) => {
  const items = [
    {
      label: 'Edit category',
      key: '1',
      onClick: () => {}
    },
    {
      label: 'Delete category',
      key: '2',
      danger: true,
      onClick: () => onDelete(id)
    }
  ];

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryText}>
        <span className={styles.categoryTitle} style={{ color: color }}>
          {emoji ? <span>{emoji}</span> : null}
          {title}
        </span>
        <span className={styles.categoryDescription}>{description}</span>
      </div>
      {isLoading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
      ) : (
        <Dropdown menu={{ items }}>
          {/*<a onClick={(e) => e.preventDefault()}>*/}
          <MoreIcon />
          {/*</a>*/}
        </Dropdown>
      )}
    </div>
  );
};

export default CategoryItem;
