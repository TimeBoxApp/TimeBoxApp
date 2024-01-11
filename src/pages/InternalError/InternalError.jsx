import React from 'react';
import { Button, Result } from 'antd';
import { Helmet } from 'react-helmet';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './internal-error.module.scss';

const InternalError = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();

  return (
    <div className={styles.internalError}>
      <Helmet>
        <title>{t('primary.helmet.internalError')}</title>
      </Helmet>
      <Result
        status="500"
        title="500"
        subTitle={t('internalError.message')}
        extra={
          <Button type="primary" onClick={() => navigate('/board')}>
            {t('internalError.button')}
          </Button>
        }
      />
    </div>
  );
};

export default InternalError;
