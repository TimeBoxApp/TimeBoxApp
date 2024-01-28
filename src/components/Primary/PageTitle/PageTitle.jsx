import styles from './page-title.module.scss';

const PageTitle = ({ subtitle, pageTitle }) => {
  return (
    <div className={styles.pageTitle}>
      {subtitle}
      <h2>{pageTitle}</h2>
    </div>
  );
};

export default PageTitle;
