import styles from './tag.module.scss';

const Tag = ({ text, color, emoji }) => {
  if (!text) return null;

  const getTextColor = (backgroundColor) => {
    if (!backgroundColor) return 'white';

    const color = backgroundColor.charAt(0) === '#' ? backgroundColor.substring(1, 7) : backgroundColor;
    const red = parseInt(color.substring(0, 2), 16);
    const green = parseInt(color.substring(2, 4), 16);
    const blue = parseInt(color.substring(4, 6), 16);
    const yiq = (red * 299 + green * 587 + blue * 114) / 1000;

    return yiq >= 128 ? 'black' : 'white';
  };

  return (
    <span className={styles.tag} style={{ backgroundColor: `${color}`, color: getTextColor(color) }}>
      {emoji ? <span>{emoji}</span> : null}
      {text}
    </span>
  );
};

export default Tag;
