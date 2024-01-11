import { Helmet } from 'react-helmet';
import { Button, Result } from 'antd';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './not-found.module.scss';

const NotFound = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();

  return (
    <div className={styles.notFound}>
      <Helmet>
        <title>{t('primary.helmet.notFound')}</title>
      </Helmet>
      <Result
        status="404"
        title="404"
        subTitle={t('notFound.message')}
        extra={
          <Button type="primary" onClick={() => navigate('/board')}>
            {t('notFound.button')}
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
