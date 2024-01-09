import styles from './tag.module.scss';

const Tag = ({ text }) => {
  if (!text) return null;

  return <span className={styles.tag}>{text}</span>;
};

export default Tag;
