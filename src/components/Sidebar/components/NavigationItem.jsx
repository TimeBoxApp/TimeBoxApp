import cn from 'classnames';

import { NavLink } from 'react-router-dom';

import styles from './navigation-item.module.scss';

const NavigationItem = (props) => {
  const { path, text, icon } = props;

  return (
    <NavLink to={path}>
      {({ isActive }) => (
        <div className={cn(styles.container, { [styles.active]: isActive })}>
          <>{icon}</>
          <span className={cn(styles.text, { [styles.active]: isActive })}>{text}</span>
          <div className={styles.indicator} />
        </div>
      )}
    </NavLink>
  );
};

export default NavigationItem;
